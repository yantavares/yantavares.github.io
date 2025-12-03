# Chá de Casa Nova

A modern, interactive web application designed for wedding or housewarming gift registries. This project features a sophisticated "Apple-style" design with scrollytelling elements, real-time guest management, and a secure administrative panel.

## Technologies

- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS Modules, Framer Motion (Animations), Canvas Confetti
- **Backend:** Supabase (PostgreSQL, Auth, Storage)

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cha-casa-nova
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

- `src/pages`: Main application views (Home, Admin, Login).
- `src/components`: Reusable UI components (ProductCard, RSVPModal).
- `src/lib`: Supabase client configuration and type definitions.
- `src/hooks`: Custom React hooks for Authentication and Toast notifications.
- `src/styles`: Global and component-specific CSS files.
