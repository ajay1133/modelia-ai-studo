# AI Studio - AI Image Generation Platform

## Overview

AI Studio is a full-stack web application for generating AI artwork. Users can create AI-generated images by providing text prompts, selecting artistic styles, and optionally uploading reference images. The platform features user authentication, a visual workspace for image generation, and a history system to track and revisit past creations.

The application is built as a modern single-page application (SPA) with a React frontend and Express backend, designed to provide a clean, visual-first experience inspired by leading AI creative tools like Midjourney and Linear.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for the UI framework
- **Vite** as the build tool and development server
- **Wouter** for client-side routing
- **TanStack Query** for server state management and caching
- **shadcn/ui** with Radix UI primitives for component library
- **Tailwind CSS** for styling with custom design tokens

**Design System:**
- Based on shadcn/ui "new-york" style variant
- Custom color system using HSL values with CSS variables for theming
- Support for light/dark themes via ThemeProvider
- Typography uses Inter for UI and JetBrains Mono for technical elements
- Responsive spacing system based on Tailwind's scale (2, 4, 6, 8, 12, 16, 24)

**Key Architectural Decisions:**
- **Component-based architecture**: Reusable UI components in `client/src/components/ui/`
- **Page-based routing**: Main application pages (Landing, Auth, Studio) in `client/src/pages/`
- **API abstraction layer**: Centralized API calls through `client/src/lib/api.ts` with AuthService and GenerationService classes
- **Visual-first design**: Emphasis on showcasing generated images prominently with gallery-style history

**State Management Approach:**
- Local component state with React hooks for UI state
- TanStack Query for server state (user data, generation history)
- localStorage for authentication token persistence
- Context API for theme management

### Backend Architecture

**Technology Stack:**
- **Express.js** for the HTTP server
- **TypeScript** with ESM modules
- **Drizzle ORM** for database interactions (configured for PostgreSQL via Neon)
- **JWT** for authentication tokens
- **bcrypt** for password hashing
- **Multer** for file upload handling

**API Design:**
- RESTful API endpoints under `/api/*`
- Authentication endpoints: `/api/auth/signup`, `/api/auth/login`
- Generation endpoints: `/api/generate`, `/api/generations`, `/api/generations/:id`
- File upload endpoint: `/api/upload`
- Bearer token authentication via middleware

**Storage Pattern:**
- Abstract storage interface (`IStorage`) defined in `server/storage.ts`
- In-memory implementation (`MemStorage`) for development
- Designed to be swappable with database-backed storage (Drizzle schema defined but not yet fully integrated)
- Uploaded images stored in local `uploads/` directory

**Authentication Flow:**
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Token stored in localStorage on client
- Authorization header middleware validates tokens on protected routes

**Key Architectural Decisions:**
- **Separation of concerns**: Auth logic separated into `server/auth.ts`, storage abstraction in `server/storage.ts`
- **Mock generation**: Currently returns mock/example images rather than calling actual AI services
- **File handling**: Direct filesystem storage for uploaded images with UUID-based filenames
- **Error handling**: Custom ApiError class with retry flags for client-side error recovery

### Database Schema

**Tables (Drizzle Schema):**

1. **users**
   - `id`: UUID primary key (auto-generated)
   - `username`: Unique text, not null
   - `password`: Hashed password text, not null

2. **generations**
   - `id`: UUID primary key (auto-generated)
   - `userId`: Foreign key to users (cascade delete)
   - `prompt`: Text prompt, not null
   - `style`: Text style selection, not null
   - `imageUrl`: Generated image URL, not null
   - `uploadedImage`: Optional reference image path
   - `createdAt`: Timestamp with default now()

**Validation:**
- Zod schemas for input validation (insertUserSchema, loginSchema, insertGenerationSchema)
- Username: 3-50 characters
- Password: Minimum 6 characters
- Prompt: 1-1000 characters
- Style: Enum of "realistic", "artistic", "abstract", "cyberpunk"

**Current State:**
- Schema defined and migration-ready with `drizzle-kit`
- Application currently uses in-memory storage (MemStorage)
- Database connection configured for PostgreSQL via `@neondatabase/serverless`
- Migration files go to `./migrations/` directory

### External Dependencies

**Third-Party UI Libraries:**
- **Radix UI**: Headless UI primitives for accessible components (dialogs, dropdowns, menus, etc.)
- **Lucide React**: Icon library
- **date-fns**: Date formatting and manipulation
- **class-variance-authority**: Utility for managing component variants
- **tailwind-merge**: Intelligent Tailwind class merging

**Development Tools:**
- **Replit integrations**: Vite plugins for error overlay, cartographer, dev banner
- **Jest** with ts-jest for unit testing
- **Supertest** for API testing
- **TypeScript**: Strict mode enabled with path aliases

**Build & Deployment:**
- **esbuild**: Server bundling for production
- **Vite**: Client bundling with React plugin
- Production build outputs to `dist/` directory
- Static assets served from `dist/public/`

**Database & ORM:**
- **Drizzle ORM**: Type-safe PostgreSQL ORM
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- Connection via `DATABASE_URL` environment variable

**Authentication & Security:**
- **jsonwebtoken**: JWT generation and verification
- **bcrypt**: Password hashing (version 6.0.0 with native bindings)
- JWT secret from environment variable (defaults to dev key)

**File Handling:**
- **multer**: Multipart form data handling for image uploads
- 10MB file size limit
- Image MIME type validation

**Key Integration Points:**
- No external AI generation API currently integrated (uses mock images)
- Static asset references from `attached_assets/generated_images/` directory
- Google Fonts CDN for Inter and JetBrains Mono fonts