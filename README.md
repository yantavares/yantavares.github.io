# Yan Tavares - Portfolio

A professional portfolio website built with React and TypeScript, designed to showcase software engineering projects, academic research, and professional certifications.

## Overview

This application serves as a dynamic resume and portfolio, featuring:
- **GitHub Integration**: Automatically fetches and displays repositories using the GitHub API.
- **Interactive UI**: Utilizes Framer Motion for smooth animations, scroll effects, and transitions.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Achievements Section**: Dedicated areas for Open Source contributions, Scientific Papers, and Certifications.

## Technologies

- **Core**: React 19, TypeScript, Vite
- **Styling**: CSS Modules, Framer Motion
- **Icons**: React Icons
- **Effects**: Canvas Confetti
- **Deployment**: GitHub Pages

## Project Structure

- `src/pages`: Main application views.
- `src/components`: Reusable UI components (ProjectCard).
- `src/hooks`: Custom hooks (useGithubProjects).
- `src/data`: Static data definitions (achievements, papers, certifications).
- `src/styles`: Global and component-specific styles.

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd new-resume
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Build for Production**

   ```bash
   npm run build
   ```

## License

This project is licensed under the MIT License.
