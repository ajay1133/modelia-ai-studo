import { 
  type User, 
  type InsertUser, 
  type Generation, 
  type InsertGeneration 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerationsByUserId(userId: string, limit?: number): Promise<Generation[]>;
  getGeneration(id: string): Promise<Generation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private generations: Map<string, Generation>;

  constructor() {
    this.users = new Map();
    this.generations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = randomUUID();
    const generation: Generation = {
      ...insertGeneration,
      uploadedImage: insertGeneration.uploadedImage ?? null,
      id,
      createdAt: new Date(),
    };
    this.generations.set(id, generation);
    return generation;
  }

  async getGenerationsByUserId(userId: string, limit: number = 5): Promise<Generation[]> {
    const allUserGenerations = Array.from(this.generations.values())
      .filter((gen) => gen.userId === userId);
    
    const sorted = allUserGenerations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return sorted.slice(0, Math.min(limit, sorted.length));
  }

  async getGeneration(id: string): Promise<Generation | undefined> {
    return this.generations.get(id);
  }
}

export const storage = new MemStorage();
