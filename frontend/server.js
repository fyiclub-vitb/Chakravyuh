const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Disable compression middleware for Unity files (they're already compressed)
app.use((req, res, next) => {
    if (req.url.includes('/Build/') || req.url.endsWith('.gz')) {
        return next();
    }
    compression()(req, res, next);
});

// Serve Unity WebGL files with proper headers
app.get('*.data.gz', (req, res, next) => {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/octet-stream');
    next();
});

app.get('*.wasm.gz', (req, res, next) => {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/wasm');
    next();
});

app.get('*.js.gz', (req, res, next) => {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/javascript');
    next();
});

app.get('*.symbols.json.gz', (req, res, next) => {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/json');
    next();
});

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filePath) => {
        // Add CORS headers if needed
        res.set('Cross-Origin-Opener-Policy', 'same-origin');
        res.set('Cross-Origin-Embedder-Policy', 'require-corp');
    }
}));

// Handle React Router - serve index.html for all non-file routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
