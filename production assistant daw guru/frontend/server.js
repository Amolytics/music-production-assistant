// Simple Express server to serve static files and set CSP header
const express = require('express');
const path = require('path');
const app = express();

// Set CSP header with nonce for all responses
const crypto = require('crypto');
app.use((req, res, next) => {
  // Generate a random nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' https://js.stripe.com blob: 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`
  );
  next();
});

// Serve static files from the dist directory (Vite/React build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing (Express v5+)
// Render index.html as a template and inject the nonce for CSP and inline tags
const fs = require('fs');
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Error loading index.html');
      return;
    }
    // Replace {{NONCE}} with the generated nonce
    const rendered = html.replace(/\{\{NONCE\}\}/g, res.locals.nonce);
    res.send(rendered);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
