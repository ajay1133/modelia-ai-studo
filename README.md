# Modelia - Image Generation Application

This README provides a comprehensive guide on how to set up and run the Modelia application, which consists of both a server and a client component.

## Prerequisites

Before running the application, ensure you have the following requirements met:

1. **Node.js Installation**
   - Install Node.js version 18.x or higher
   - Verify installation with: `node --version`

2. **Database Setup**
   - PostgreSQL database is required
   - Set up your database connection string in the environment variables:
     ```bash
     DATABASE_URL=postgresql://user:password@localhost:5432/your_database
     ```

3. **Environment Configuration**
   - Create a `.env` file in the root directory with the following variables:
     ```env
     DATABASE_URL=your_postgresql_connection_string
     NODE_ENV=development
     SESSION_SECRET=your_session_secret
     ```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npm run db:push
   ```

## Running the Application

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Build and Start Production**
   ```bash
   npm run build
   npm start
   ```

## Usage Guide

### Authentication Flow

1. **Sign Up**
   - Navigate to `/auth` or click "Sign Up" on the landing page
   - Fill in the registration form with:
     - Username
     - Password (minimum 8 characters)
   - Submit the form

2. **Login**
   - Navigate to `/auth` or click "Login"
   - Enter your credentials
   - Click "Login"

### Image Generation

1. **Upload an Image**
   - In the Generation Workspace:
     - Click the upload area or drag and drop an image
     - Supported formats: JPG, PNG
     - Maximum size: 5MB

2. **Generate Images**
   - Select a style from the Style Selector
   - Enter your prompt in the text input
   - Click "Generate"

3. **View Generation History**
   - Latest 5 generations appear in the Generation History panel
   - Click on any generation to view details

### User Interface Features

1. **Theme Toggle**
   - Click the sun/moon icon in the top right corner to switch between light and dark modes
   - The theme preference is automatically saved

2. **Abort Generation**
   - During image generation, click the "Cancel" button to abort the current request
   - The system will immediately stop the generation process

3. **View Generation History**
   - Click on the "History" tab to view your last 5 generations
   - Each entry shows:
     - Thumbnail
     - Prompt used
     - Generation date
     - Style applied

## Troubleshooting

- **Database Connection Issues**
  - Verify your DATABASE_URL is correct
  - Ensure PostgreSQL is running
  - Check database user permissions

- **Image Upload Problems**
  - Check storage permissions in the uploads directory

## Support

For issues and feature requests, please create an issue in the repository.