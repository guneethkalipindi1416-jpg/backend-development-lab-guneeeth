# Lab 1: Node.js and Express server

**Name:** Guneeth  
**Registration Number:** RA2311003010000  
**Section:** CSE-Core  
**Course:** Backend Development Fundamentals (Year II Term II)  
**Faculty:** Joel Prashanth D  

---

## Live Link
- **Deployment URL:** [https://lab-01-express-server.onrender.com](https://lab-01-express-server.onrender.com) *(Example production link on Render / Railway)*
- *(Note: If testing locally or offline, follow the "How to run" section below.)*

---

## Overview & Objectives
This lab covers the fundamentals of backend development in Node.js and Express.js:
1. Initializing a Node.js project using `npm init -y` and understanding the schema and role of `package.json`.
2. Installing third-party packages (`express`) and inspecting the dependency tree inside `node_modules`.
3. Creating a low-level HTTP web server using Node.js's built-in `http` module.
4. Refactoring the server to Express.js for higher-level route handling, middleware integration, and clean architecture.
5. Implementing RESTful `GET` routes (`/`, `/about`, `/time`) and a fallback `404 Not Found` handler.
6. Monitoring and logging every incoming HTTP request alongside its response status code.

---

## Detailed Explanation of `package.json` Fields

When `npm init -y` is run, it generates a manifest file named `package.json`. Here is what each field represents:

| Field | Purpose & Description |
|---|---|
| `"name"` | The unique identifier / name of the project or package. Must be lowercase and URL-friendly without spaces. |
| `"version"` | The current version of the project following Semantic Versioning (`MAJOR.MINOR.PATCH`, e.g., `1.0.0`). |
| `"description"` | A short textual summary explaining what the project or package does. |
| `"main"` | The primary entry point file of the application (e.g., `server.js` or `index.js`). When required as a module, this file is loaded. |
| `"scripts"` | Key-value pairs defining CLI shortcut scripts executed via `npm run <script>` (or `npm start`, `npm test`). |
| `"keywords"` | An array of searchable tags/keywords to help users discover the package on npm. |
| `"author"` | Name and contact information of the project creator or maintainer. |
| `"license"` | The open-source or proprietary license under which the code is released (e.g., `ISC`, `MIT`). |
| `"dependencies"` | Production packages required at runtime (e.g., `express`). These are installed when running `npm install`. |

---

## Location of Express inside `node_modules`
When running `npm install express`:
- npm downloads the Express library into the `./node_modules/express/` folder.
- All transitive dependencies that Express relies on (such as `accepts`, `body-parser`, `content-type`, `negotiator`, `router`, etc.) are also downloaded into `node_modules/`.
- `package-lock.json` is generated to lock down the exact versions and integrity hashes of every installed package, guaranteeing reproducible builds.

---

## Plain HTTP Server vs Express Server Comparison

### 1. Plain HTTP (`http-server.js`)
Uses the Node.js native core module `http`. It requires manual parsing of URLs, manual headers setting with `res.writeHead()`, and low-level stream termination with `res.end()`.
```javascript
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello\n');
});
server.listen(3000);
```

### 2. Express Server (`server.js`)
Express abstracts boilerplate HTTP handling into a clean, minimalist routing and middleware framework. It provides helper methods such as `res.status()`, `res.send()`, and `res.json()`, and pipeline-based middleware execution.

---

## How to Run

### Prerequisites
- Node.js (version 18.x, 20.x, or 22.x recommended)
- npm (version 9.x or 10.x)

### 1. Installation
Clone the repository and navigate into the `lab-01` directory:
```bash
git clone <repository-url>
cd backend-labs/lab-01
npm install
```

### 2. Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Supported variables in `.env` (no sensitive secrets required):
```env
PORT=3000
STUDENT_NAME=Guneeth
STUDENT_REG_NO=RA2311003010000
STUDENT_SECTION=CSE-Core
```

### 3. Start Commands

- **To run the Plain HTTP Server (Task 3):**
  ```bash
  npm run start:http
  # Or: node http-server.js
  ```

- **To run the Express Web Server (Tasks 4–7):**
  ```bash
  npm start
  # Or: node server.js
  ```

- **To run in Development Watch Mode (auto-reload on edit):**
  ```bash
  npm run dev
  # Or: node --watch server.js
  ```

---

## Endpoints Table

| HTTP Method | Route / Path | Description | Expected Status Code | Content Type | Sample Response |
|---|---|---|---|---|---|
| `GET` | `/` | Welcoming text message | `200 OK` | `text/html; charset=utf-8` | `"Welcome to Lab 1: Node.js and Express Server!"` |
| `GET` | `/about` | Information about student and section | `200 OK` | `application/json` | `{"name":"Guneeth","registrationNumber":"RA2311003010000","section":"CSE-Core","course":"Backend Development Fundamentals","faculty":"Joel Prashanth D"}` |
| `GET` | `/time` | Current date and timestamp using `new Date()` | `200 OK` | `application/json` | `{"currentTime":"2026-11-01T13:19:01.867Z","humanReadable":"Sun Nov 01 2026 18:49:01 GMT+0530","timestamp":1793539141867}` |
| `ALL` | `/*` (unknown) | Fallback 404 handler for any unregistered path | `404 Not Found` | `application/json` | `{"status":404,"error":"Not Found","message":"Cannot GET /unknown-route. This route does not exist on this server."}` |

---

## Screenshots

### 1. Root Endpoint (`GET /`)
Responds with a 200 OK status code and welcome text.
![GET / route output](screenshots/root-route.png)

### 2. About Endpoint (`GET /about`)
Responds with a 200 OK status code and a JSON object containing student details.
![GET /about route output](screenshots/about-route.png)

### 3. Time Endpoint (`GET /time`)
Responds with a 200 OK status code and real-time server timestamp generated via `new Date()`.
![GET /time route output](screenshots/time-route.png)

### 4. 404 Not Found Handling (`GET /unknown-route`)
Catches any unregistered URL pattern and sends back a standard 404 Not Found status with JSON error message.
![404 Fallback route output](screenshots/404-route.png)

### 5. Server Console Logs & Status Code Tracking
Demonstrates real-time logging of method, URL, response status code, and latency for every inbound request.
![Terminal logs showing status codes](screenshots/terminal-logs.png)

---

## Notes: Problems Faced & Solutions

1. **Port In-Use Conflict (`EADDRINUSE`):**
   - *Problem:* Running `server.js` while `http-server.js` was still listening on port `3000` resulted in an `Error: listen EADDRINUSE: address already in use :::3000`.
   - *Solution:* Added graceful shutdown handling and made the port dynamic using `process.env.PORT || 3000`. Ensured test processes were properly killed before launching a new server instance.

2. **Capturing Status Codes for Asynchronous Requests:**
   - *Problem:* In Express, when middleware runs before the route handler, `res.statusCode` defaults to 200 before the final route handler has executed or set an error code.
   - *Solution:* Implemented a listener on the response stream's `'finish'` event (`res.on('finish', ...)`). This ensures the logger only reads `res.statusCode` after the response headers and payload have been committed and sent to the client.

3. **Accidental Commitment of `node_modules`:**
   - *Problem:* `node_modules` contains thousands of files and should never be pushed to version control.
   - *Solution:* Configured both root-level and lab-level `.gitignore` files to exclude `node_modules/` and `.env` while preserving `.env.example`.

---

## Viva Questions & Answers

### 1. What is the difference between `package.json` and `node_modules`?
- **`package.json`**: A lightweight text configuration file committed to Git. It records the project metadata, run scripts, and names of required packages along with their semantic version ranges. It acts as the blueprint or recipe for the project.
- **`node_modules`**: A large directory generated on disk when you run `npm install`. It contains the actual source code and binaries of all installed packages and their transitive dependencies. It is excluded from Git (via `.gitignore`) because it can be reconstructed at any time by running `npm install`.

### 2. What does `app.listen()` do?
- In Express, `app.listen(port, [callback])` is a convenience wrapper around Node.js's native `http.createServer(app).listen(port, [callback])`.
- It binds the application to the specified network port and starts a continuous TCP listener (event loop) waiting for incoming client connections (HTTP requests). Once the socket is successfully bound, it triggers the optional callback function.

### 3. What do `request` (`req`) and `response` (`res`) represent?
- **`request` (`req`)**: An instance of `http.IncomingMessage` (enhanced by Express). It represents the incoming HTTP request from the client and encapsulates information such as the HTTP method (`GET`, `POST`), request path/URL (`req.originalUrl`), headers (`req.headers`), query parameters (`req.query`), route parameters (`req.params`), and body payload (`req.body`).
- **`response` (`res`)**: An instance of `http.ServerResponse` (enhanced by Express). It represents the outgoing HTTP response stream created by the server to reply to the client. It provides methods to set status codes (`res.status()`), headers (`res.set()`), send text (`res.send()`), or serialize JSON data (`res.json()`).
