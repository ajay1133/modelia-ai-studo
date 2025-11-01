import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";
import { storage } from "../storage";
import { hashPassword, generateToken } from "../auth";
import path from "path";
import fs from "fs";

describe("Generation API", () => {
  let app: express.Express;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  beforeEach(async () => {
    (storage as any).users.clear();
    (storage as any).generations.clear();

    const hashedPassword = await hashPassword("password123");
    const user = await storage.createUser({
      username: "testuser",
      password: hashedPassword,
    });
    userId = user.id;
    authToken = generateToken(user);
  });

  describe("POST /api/generate", () => {
    it("should generate an image with valid prompt and style", async () => {
      let attempts = 0;
      let success = false;
      
      while (attempts < 10 && !success) {
        const response = await request(app)
          .post("/api/generate")
          .set("Authorization", `Bearer ${authToken}`)
          .field("prompt", "A beautiful sunset")
          .field("style", "realistic");

        if (response.status === 200) {
          expect(response.body).toHaveProperty("id");
          expect(response.body.prompt).toBe("A beautiful sunset");
          expect(response.body.style).toBe("realistic");
          expect(response.body).toHaveProperty("imageUrl");
          success = true;
        } else if (response.status === 503) {
          expect(response.body.error).toContain("high demand");
          expect(response.body.retryable).toBe(true);
          attempts++;
        } else {
          throw new Error(`Unexpected status: ${response.status}`);
        }
      }
      
      expect(success).toBe(true);
    });

    it("should generate with uploaded image", async () => {
      const testImagePath = path.join(__dirname, "test-image.png");
      fs.writeFileSync(testImagePath, Buffer.from("fake image data"));

      let attempts = 0;
      let success = false;
      
      while (attempts < 10 && !success) {
        try {
          const response = await request(app)
            .post("/api/generate")
            .set("Authorization", `Bearer ${authToken}`)
            .field("prompt", "Transform this image")
            .field("style", "artistic")
            .attach("image", testImagePath);

          if (response.status === 200) {
            expect(response.body.uploadedImage).toBeTruthy();
            success = true;
          } else if (response.status === 503) {
            attempts++;
          } else {
            throw new Error(`Unexpected status: ${response.status}`);
          }
        } catch (error) {
          if (attempts >= 9) throw error;
          attempts++;
        }
      }

      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
      }
      
      expect(success).toBe(true);
    });

    it("should reject generation without authentication", async () => {
      await request(app)
        .post("/api/generate")
        .field("prompt", "A beautiful sunset")
        .field("style", "realistic")
        .expect(401);
    });

    it("should reject generation with invalid style", async () => {
      await request(app)
        .post("/api/generate")
        .set("Authorization", `Bearer ${authToken}`)
        .field("prompt", "A beautiful sunset")
        .field("style", "invalid-style")
        .expect(400);
    });

    it("should reject generation with empty prompt", async () => {
      const response = await request(app)
        .post("/api/generate")
        .set("Authorization", `Bearer ${authToken}`)
        .field("prompt", "")
        .field("style", "realistic");
      
      expect([400, 503]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body.error).toBeTruthy();
      }
    });
  });

  describe("GET /api/generations", () => {
    beforeEach(async () => {
      for (let i = 0; i < 7; i++) {
        await storage.createGeneration({
          userId,
          prompt: `Test prompt ${i}`,
          style: "realistic",
          imageUrl: `/mock-${i}.png`,
          uploadedImage: null,
        });
      }
    });

    it("should return last 5 generations for authenticated user", async () => {
      const response = await request(app)
        .get("/api/generations")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
      expect(response.body[0].prompt).toContain("Test prompt");
    });

    it("should reject without authentication", async () => {
      await request(app).get("/api/generations").expect(401);
    });
  });

  describe("GET /api/generations/:id", () => {
    let generationId: string;

    beforeEach(async () => {
      const generation = await storage.createGeneration({
        userId,
        prompt: "Test prompt",
        style: "realistic",
        imageUrl: "/mock.png",
        uploadedImage: null,
      });
      generationId = generation.id;
    });

    it("should return generation by id", async () => {
      const response = await request(app)
        .get(`/api/generations/${generationId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(generationId);
      expect(response.body.prompt).toBe("Test prompt");
    });

    it("should return 404 for non-existent generation", async () => {
      await request(app)
        .get("/api/generations/non-existent-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });

    it("should reject access to other user's generation", async () => {
      const otherUser = await storage.createUser({
        username: "otheruser",
        password: await hashPassword("password"),
      });
      const otherToken = generateToken(otherUser);

      await request(app)
        .get(`/api/generations/${generationId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);
    });
  });
});
