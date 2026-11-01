/**
 * Lab 1: Task 3 - Plain Node.js HTTP Server
 * Course: Backend Development Fundamentals (Year II Term II)
 * Module: Node.js and Express.js fundamentals
 *
 * Description:
 * A lightweight web server built using Node.js's built-in 'http' module.
 * It listens on port 3000 and responds with "Hello".
 */

const http = require('http');

const PORT = process.env.PORT || 3000;

// Create HTTP server using the built-in http module
const server = http.createServer((req, res) => {
  // Set response headers: HTTP 200 OK and text/plain MIME type
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  // Send the response body
  res.end('Hello\n');

  // Log incoming request and status code
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} -> 200 OK`);
});

// Start the server on port 3000
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Plain Node.js HTTP Server is running!`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to terminate the server.`);
  console.log(`=========================================`);
});
