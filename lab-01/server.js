/**
 * Lab 1: Tasks 4, 5, 6, 7 - Express Web Server
 * Course: Backend Development Fundamentals (Year II Term II)
 * Faculty: Joel Prashanth D
 *
 * Description:
 * Express server implementing routes for /, /about, /time,
 * a 404 fallback handler for unknown paths, and request/status logging.
 */

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Request Logger with Status Code Logging (Task 7)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> HTTP ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Task 5: Route 1 - GET / (welcome text)
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Lab 1: Node.js and Express Server!');
});

// Task 5: Route 2 - GET /about (JSON with name and section)
app.get('/about', (req, res) => {
  const studentInfo = {
    name: process.env.STUDENT_NAME || 'Guneeth',
    registrationNumber: process.env.STUDENT_REG_NO || 'RA2311003010000',
    section: process.env.STUDENT_SECTION || 'CSE-Core',
    course: 'Backend Development Fundamentals',
    faculty: 'Joel Prashanth D'
  };

  res.status(200).json(studentInfo);
});

// Task 5: Route 3 - GET /time (current date and time using new Date())
app.get('/time', (req, res) => {
  const now = new Date();
  res.status(200).json({
    currentTime: now.toISOString(),
    humanReadable: now.toString(),
    timestamp: now.getTime()
  });
});

// Task 6: 404 handler for any unknown path
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. This route does not exist on this server.`
  });
});

// Task 4: Start Express server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Express server running on: http://localhost:${PORT}`);
  console.log(`Available Endpoints:`);
  console.log(`  - GET  /         (Welcome message)`);
  console.log(`  - GET  /about    (Student details JSON)`);
  console.log(`  - GET  /time     (Current server date & time JSON)`);
  console.log(`  - ANY  /*        (404 fallback handler)`);
  console.log(`=======================================================`);
});
