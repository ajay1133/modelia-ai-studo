import { MemStorage } from "../storage";
import { hashPassword } from "../auth";

describe("MemStorage", () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  describe("User operations", () => {
    it("should create and retrieve user", async () => {
      const hashedPassword = await hashPassword("password123");
      const user = await storage.createUser({
        username: "testuser",
        password: hashedPassword,
      });

      expect(user.id).toBeDefined();
      expect(user.username).toBe("testuser");

      const retrieved = await storage.getUser(user.id);
      expect(retrieved).toEqual(user);
    });

    it("should retrieve user by username", async () => {
      const hashedPassword = await hashPassword("password123");
      const user = await storage.createUser({
        username: "testuser",
        password: hashedPassword,
      });

      const retrieved = await storage.getUserByUsername("testuser");
      expect(retrieved).toEqual(user);
    });

    it("should return undefined for non-existent user", async () => {
      const user = await storage.getUser("non-existent");
      expect(user).toBeUndefined();
    });
  });

  describe("Generation operations", () => {
    let userId: string;

    beforeEach(async () => {
      const hashedPassword = await hashPassword("password123");
      const user = await storage.createUser({
        username: "testuser",
        password: hashedPassword,
      });
      userId = user.id;
    });

    it("should create and retrieve generation", async () => {
      const generation = await storage.createGeneration({
        userId,
        prompt: "Test prompt",
        style: "realistic",
        imageUrl: "/test.png",
        uploadedImage: null,
      });

      expect(generation.id).toBeDefined();
      expect(generation.userId).toBe(userId);
      expect(generation.prompt).toBe("Test prompt");
      expect(generation.createdAt).toBeInstanceOf(Date);

      const retrieved = await storage.getGeneration(generation.id);
      expect(retrieved).toEqual(generation);
    });

    it("should retrieve generations by user id", async () => {
      for (let i = 0; i < 3; i++) {
        await storage.createGeneration({
          userId,
          prompt: `Prompt ${i}`,
          style: "realistic",
          imageUrl: `/test-${i}.png`,
          uploadedImage: null,
        });
      }

      const generations = await storage.getGenerationsByUserId(userId);
      expect(generations.length).toBe(3);
      expect(generations[0].prompt).toBe("Prompt 2");
    });

    it("should limit generations returned", async () => {
      for (let i = 0; i < 10; i++) {
        await storage.createGeneration({
          userId,
          prompt: `Prompt ${i}`,
          style: "realistic",
          imageUrl: `/test-${i}.png`,
          uploadedImage: null,
        });
      }

      const generations = await storage.getGenerationsByUserId(userId, 5);
      expect(generations.length).toBe(5);
    });

    it("should return empty array for user with no generations", async () => {
      const generations = await storage.getGenerationsByUserId(userId);
      expect(generations).toEqual([]);
    });
  });
});
