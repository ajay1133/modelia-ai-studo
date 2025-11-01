import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";
import { storage } from "../storage";
import { hashPassword } from "../auth";

describe("Authentication API", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  afterEach(async () => {
    (storage as any).users.clear();
    (storage as any).generations.clear();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "testuser",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.username).toBe("testuser");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should reject signup with existing username", async () => {
      const hashedPassword = await hashPassword("password123");
      await storage.createUser({
        username: "testuser",
        password: hashedPassword,
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "testuser",
          password: "newpassword",
        })
        .expect(400);

      expect(response.body.error).toBe("Username already exists");
    });

    it("should reject signup with short username", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "ab",
          password: "password123",
        })
        .expect(400);

      expect(response.body.error).toContain("at least 3 characters");
    });

    it("should reject signup with short password", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "testuser",
          password: "12345",
        })
        .expect(400);

      expect(response.body.error).toContain("at least 6 characters");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await hashPassword("password123");
      await storage.createUser({
        username: "testuser",
        password: hashedPassword,
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "testuser",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.username).toBe("testuser");
    });

    it("should reject login with invalid username", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "wronguser",
          password: "password123",
        })
        .expect(401);

      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should reject login with invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "testuser",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.error).toBe("Invalid credentials");
    });
  });
});
