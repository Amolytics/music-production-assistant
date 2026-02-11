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

## Osano Cookie Consent Script Removal

The Osano cookie consent script was removed from the project because it injected an invalid SVG (`viewBox: \"0 0 100% 46px\"`) that caused browser errors and could not be fixed from the app code. If cookie consent is required, consider using an alternative provider or wait for Osano to fix this bug.

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

## Navigation

- The app now uses a tab navigation at the top for switching between Studio and Settings.
- The Welcome screen and Setup flow have been removed for a streamlined experience.
- Settings are accessible as a dedicated tab.

## Notes

- Ensure your backend API URL is set via the `VITE_BACKEND_URL` environment variable for production.
- Favicon and all static assets should be placed in the `public/` directory.