import { InsertUser, LoginCredentials, User, Generation } from "@shared/schema";

const API_BASE = "";

class ApiError extends Error {
  constructor(public status: number, message: string, public retryable: boolean = false) {
    super(message);
    this.name = "ApiError";
  }
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async signup(credentials: InsertUser): Promise<{ user: Omit<User, "password">; token: string }> {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.error || "Signup failed");
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async login(credentials: LoginCredentials): Promise<{ user: Omit<User, "password">; token: string }> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.error || "Login failed");
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.clearToken();
  }
}

class GenerationService {
  constructor(private auth: AuthService) {}

  async generate(
    prompt: string,
    style: string,
    image: File | null,
    signal?: AbortSignal
  ): Promise<Generation> {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("style", style);
    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: this.auth.getHeaders(),
      body: formData,
      signal,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(
        response.status,
        error.error || "Generation failed",
        error.retryable || false
      );
    }

    return response.json();
  }

  async getHistory(): Promise<Generation[]> {
    const response = await fetch(`${API_BASE}/api/generations`, {
      headers: {
        ...this.auth.getHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch generation history");
    }

    return response.json();
  }

  async getGeneration(id: string): Promise<Generation> {
    const response = await fetch(`${API_BASE}/api/generations/${id}`, {
      headers: {
        ...this.auth.getHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch generation");
    }

    return response.json();
  }
}

export const authService = new AuthService();
export const generationService = new GenerationService(authService);
export { ApiError };
