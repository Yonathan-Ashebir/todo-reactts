#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname } from 'path';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appDir = join(__dirname, '..');
const distPath = join(appDir, 'dist');

// Check if dist exists, if not, build it
if (!existsSync(distPath)) {
  console.log('📦 Building Todo App...');
  try {
    execSync('npm run build', { cwd: appDir, stdio: 'inherit' });
    console.log('✅ Build complete!\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Find an available port
function findFreePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findFreePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Simple static file server
function createStaticServer(port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
  };

  const server = createServer((req, res) => {
    let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(distPath)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // Default to index.html for non-file requests
    if (!extname(filePath) && !existsSync(filePath)) {
      filePath = join(distPath, 'index.html');
    }

    if (existsSync(filePath)) {
      const ext = extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) reject(err);
      else resolve(server);
    });
  });
}

// Main function
async function start() {
  try {
    const port = await findFreePort(3000);
    const server = await createStaticServer(port);
    const url = `http://localhost:${port}`;

    console.log('\n✨ Todo App is running!');
    console.log(`📍 Local:   ${url}`);
    console.log(`\n💡 Press Ctrl+C to stop the server\n`);

    // Auto-open browser
    try {
      await open(url);
    } catch (err) {
      console.log('⚠️  Could not auto-open browser. Please open manually.');
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down...');
      server.close(() => {
        console.log('✅ Server stopped. Goodbye!');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

start();

