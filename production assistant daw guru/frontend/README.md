# Frontend Skeleton

This folder will contain the client-side code for your music production assistant. Typical structure:

- src/ (React/Vue/Angular app source)
- public/ (static assets)
- package.json (dependencies and scripts)
- index.html (main entry point)

You can use React, Vue, or any frontend framework you prefer.

## CSP Compliance

This project is fully Content Security Policy (CSP) compliant:

- All inline styles have been moved to external CSS (App.css).
- No inline scripts or styles are used in React components.
- If you add new components, use only className and external CSS for styles.

## Setup & Usage

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview production build:

   ```bash
   npm run start
   ```

## Notes

- Ensure your backend API URL is set via the `VITE_BACKEND_URL` environment variable for production.
- For static hosting, use the provided Dockerfile (nginx serves the built frontend).
- Favicon and all static assets should be placed in the `public/` directory.