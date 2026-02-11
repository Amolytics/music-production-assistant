// Simple Express server to serve static files and set CSP header
const express = require('express');
const path = require('path');
const app = express();

// Set CSP header for all responses
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://js.stripe.com blob:; style-src 'self'; object-src 'none'; base-uri 'self';"
  );
  next();
});

// Serve static files from the dist directory (Vite/React build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
