import { 
  type User, 
  type InsertUser, 
  type Generation, 
  type InsertGeneration,
  users,
  generations,
} from "@shared/schema";
import { randomUUID } from "crypto";

import pg from "pg";
import type { Pool as PgPool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc } from "drizzle-orm";

import dotenv from 'dotenv';

dotenv.config();

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerationsByUserId(userId: string, limit?: number): Promise<Generation[]>;
  getGeneration(id: string): Promise<Generation | undefined>;
}

// In-memory storage implementation (useful for tests and local dev)
export class MemStorage implements IStorage {
  public users: Map<string, User> = new Map();
  public generations: Map<string, Generation> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { id, ...insertUser } as User;
    this.users.set(id, user);
    return user;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = randomUUID();
    // Ensure monotonically increasing createdAt timestamps to make ordering deterministic in tests
    const createdAt = new Date(Date.now() + this.generations.size);
    const generation: Generation = {
      id,
      ...insertGeneration,
      uploadedImage: insertGeneration.uploadedImage ?? null,
      createdAt,
    } as Generation;
    this.generations.set(id, generation);
    return generation;
  }

  async getGenerationsByUserId(userId: string, limit: number = 5): Promise<Generation[]> {
    const all = Array.from(this.generations.values()).filter(g => g.userId === userId);
    all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return all.slice(0, limit);
  }

  async getGeneration(id: string): Promise<Generation | undefined> {
    return this.generations.get(id);
  }
}

class PostgresStorage implements IStorage {
  private readonly pool: PgPool;
  private readonly db: ReturnType<typeof drizzle>;

  constructor(connectionString: string) {
    // runtime: pg exports a default CJS object; use pg.Pool at runtime
    this.pool = new pg.Pool({ connectionString }) as unknown as PgPool;
    this.db = drizzle(this.pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const res = await this.db.select().from(users).where(eq(users.id, id));
    return res[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const res = await this.db.select().from(users).where(eq(users.username, username));
    return res[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [created] = await this.db.insert(users).values({ id, ...insertUser }).returning();
    return created as User;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = randomUUID();
    const now = new Date();
    const toInsert = {
      id,
      ...insertGeneration,
      uploadedImage: insertGeneration.uploadedImage ?? null,
      createdAt: now
    };
    const [created] = await this.db.insert(generations).values(toInsert).returning();
    // Ensure the returned timestamp is in UTC
    if (created.createdAt) {
      created.createdAt = new Date(created.createdAt.toISOString());
    }
    return created as Generation;
  }

  async getGenerationsByUserId(userId: string, limit: number = 5): Promise<Generation[]> {
    const res = await this.db.select().from(generations).where(eq(generations.userId, userId)).orderBy(desc(generations.createdAt)).limit(limit);
    // Ensure all timestamps are in UTC
    return res.map(gen => ({
      ...gen,
      createdAt: new Date(gen.createdAt.toISOString())
    })) as Generation[];
  }

  async getGeneration(id: string): Promise<Generation | undefined> {
    const res = await this.db.select().from(generations).where(eq(generations.id, id));
    if (res[0] && res[0].createdAt) {
      // Ensure timestamp is in UTC
      res[0].createdAt = new Date(res[0].createdAt.toISOString());
    }
    return res[0] as Generation | undefined;
  }
}
const connection = process.env.DATABASE_URL;
if (!connection) {
  throw new Error("DATABASE_URL is not set. Please configure PostgreSQL connection string in environment.");
}

// Export a mutable storage binding so tests can swap in-memory storage easily
export let storage: IStorage = new PostgresStorage(connection);

export function setStorage(s: IStorage) {
  storage = s;
}
