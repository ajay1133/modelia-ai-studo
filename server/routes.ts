import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertGenerationSchema } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, authMiddleware, type AuthRequest } from "./auth";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const mockGeneratedImages = [
  "/api/mock-images/example1.png",
  "/api/mock-images/example2.png",
  "/api/mock-images/example3.png",
  "/api/mock-images/example4.png",
  "/api/mock-images/example5.png",
];

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
      });

      const token = generateToken(user);
      
      res.json({
        user: { id: user.id, username: user.username },
        token,
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user);
      
      res.json({
        user: { id: user.id, username: user.username },
        token,
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post(
    "/api/generate",
    authMiddleware,
    upload.single("image"),
    async (req: AuthRequest, res) => {
      try {
        const validatedData = insertGenerationSchema.parse({
          userId: req.user!.id,
          prompt: req.body.prompt,
          style: req.body.style,
          imageUrl: "",
          uploadedImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        if (Math.random() < 0.2) {
          return res.status(503).json({ 
            error: "Our AI models are currently experiencing high demand. Please try again in a moment.",
            retryable: true,
          });
        }

        let aborted = false;
        req.on("close", () => {
          aborted = true;
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (aborted || req.destroyed) {
          return;
        }

        const randomImage = mockGeneratedImages[Math.floor(Math.random() * mockGeneratedImages.length)];
        
        const generation = await storage.createGeneration({
          ...validatedData,
          imageUrl: randomImage,
        });

        if (!aborted && !req.destroyed) {
          res.json(generation);
        }
      } catch (error: any) {
        if (error.errors) {
          return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  app.get("/api/generations", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const generations = await storage.getGenerationsByUserId(req.user!.id, 5);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/generations/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const generation = await storage.getGeneration(req.params.id);
      
      if (!generation) {
        return res.status(404).json({ error: "Generation not found" });
      }

      if (generation.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(generation);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  
  const httpServer = createServer(app);

  return httpServer;
}
