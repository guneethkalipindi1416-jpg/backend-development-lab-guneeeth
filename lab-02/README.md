# Lab 2: SQLite database and CRUD routes

**Name:** Guneeth Kalipindi  
**Registration Number:** RA2311003010000  
**Section:** CSE-Core  
**Course:** Backend Development Fundamentals (Year II Term II)  
**Faculty:** Joel Prashanth D  
**GitHub Repository:** [https://github.com/guneethkalipindi1416-jpg/backend-development-lab-guneeeth](https://github.com/guneethkalipindi1416-jpg/backend-development-lab-guneeeth)  

---

## Live Link
- **Deployment URL:** [https://lab-02-sqlite-crud.onrender.com](https://lab-02-sqlite-crud.onrender.com) *(Example production link on Render / Railway)*
- *(Note: If testing locally or offline, follow the "How to run" instructions below.)*

---

## Overview & Objectives
The primary objective of this lab is to integrate an Express web application with a relational SQLite database, establishing a complete CRUD (Create, Read, Update, Delete) pipeline with parameterized queries.

### Key Learnings & Tasks Completed:
1. **Tooling & Hot-Reloading:** Installed `sqlite`, `sqlite3` driver, and `nodemon` for instantaneous server reloads during development.
2. **Database Initialization & Schema:** Created `goodreads.db` with a relational table `book` containing fields `id`, `title`, `author`, `price`, and `pages`. Seeded 10 initial book entries.
3. **Connection Lifecycle:** Implemented `initializeDBAndServer()` to ensure the database connection resolves successfully before the Express server begins listening on the network port.
4. **RESTful CRUD Routes:**
   - `GET /books/` (Read all)
   - `GET /books/:bookId/` (Read single record by ID)
   - `POST /books/` (Create new record)
   - `PUT /books/:bookId/` (Update existing record)
   - `DELETE /books/:bookId/` (Delete record)
5. **SQL Injection Defense:** Enforced `?` parameterized placeholders across all input-driven database queries.
6. **Verification & Testing:** Tested every route with Postman and cross-verified data persistence directly against the SQLite database.

---

## Database Schema & Seed Data

### Table Definition (`book`)
```sql
CREATE TABLE book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);
```

### Initial Seed Records (10 Books)
| ID | Title | Author | Price (₹) | Pages |
|---|---|---|---|---|
| 1 | The Great Gatsby | F. Scott Fitzgerald | 450 | 180 |
| 2 | To Kill a Mockingbird | Harper Lee | 520 | 281 |
| 3 | 1984 | George Orwell | 399 | 328 |
| 4 | Pride and Prejudice | Jane Austen | 350 | 279 |
| 5 | The Catcher in the Rye | J.D. Salinger | 420 | 214 |
| 6 | The Hobbit | J.R.R. Tolkien | 599 | 310 |
| 7 | Fahrenheit 451 | Ray Bradbury | 380 | 249 |
| 8 | Brave New World | Aldous Huxley | 410 | 268 |
| 9 | Crime and Punishment | Fyodor Dostoevsky | 650 | 671 |
| 10 | The Alchemist | Paulo Coelho | 299 | 208 |

---

## Architectural Pattern: `initializeDBAndServer()`

Connecting to a database is an asynchronous I/O operation. If the Express server starts listening before the database connection object is instantiated, incoming HTTP requests will encounter `TypeError: Cannot read properties of null (reading 'all')`.

To prevent this race condition, `initializeDBAndServer()` strictly guarantees the database driver connection completes first:

```javascript
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
```

---

## How to Run

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
Navigate into the `lab-02` directory and install project dependencies:
```bash
cd backend-labs/lab-02
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Contents of `.env`:
```env
PORT=3000
DB_PATH=./goodreads.db
```

### 4. Database Setup & Seeding
To reset and re-seed the SQLite database with the default 10 books:
```bash
npm run seed
# Or: node seed.js
```

### 5. Running the Application
- **Development Mode with auto-reloading (via nodemon):**
  ```bash
  npm run dev
  # Or: npx nodemon server.js
  ```
- **Standard Production Mode:**
  ```bash
  npm start
  # Or: node server.js
  ```

---

## Endpoints Table

| HTTP Method | Route | Description | Expected Status | Request Body (JSON) | Sample Response |
|---|---|---|---|---|---|
| `GET` | `/books/` | Fetch all books | `200 OK` | None | `[{"id":1,"title":"The Great Gatsby",...}]` |
| `GET` | `/books/:bookId/` | Fetch single book by ID | `200 OK` / `404 Not Found` | None | `{"id":1,"title":"The Great Gatsby",...}` |
| `POST` | `/books/` | Add a new book | `201 Created` / `400 Bad Request` | `{"title":"...","author":"...","price":...,"pages":...}` | `{"message":"Book Added Successfully","bookId":11}` |
| `PUT` | `/books/:bookId/` | Update an existing book | `200 OK` / `404 Not Found` | `{"title":"...","author":"...","price":...,"pages":...}` | `{"message":"Book Details Updated Successfully","updatedBookId":1}` |
| `DELETE` | `/books/:bookId/` | Remove a book by ID | `200 OK` / `404 Not Found` | None | `{"message":"Book Deleted Successfully","deletedBookId":10}` |

---

## Postman & Output Screenshots

### 1. GET All Books (`GET /books/`)
Retrieves all records stored in the SQLite `book` table with status `200 OK`.
![GET all books Postman](screenshots/get-all-books.png)

### 2. GET Single Book (`GET /books/1/`)
Retrieves a specific book record using the parameterized URL parameter `:bookId`.
![GET single book Postman](screenshots/get-single-book.png)

### 3. POST Add Book (`POST /books/`)
Submits a JSON body to insert a new book record; responds with `201 Created` and the generated `bookId`.
![POST add book Postman](screenshots/post-book.png)

### 4. PUT Update Book (`PUT /books/1/`)
Updates existing book details in the database using parameterized queries; responds with `200 OK`.
![PUT update book Postman](screenshots/put-book.png)

### 5. DELETE Remove Book (`DELETE /books/10/`)
Deletes the specified book from the database; responds with `200 OK` confirming removal.
![DELETE book Postman](screenshots/delete-book.png)

### 6. Terminal Output with `nodemon`
Shows `nodemon` actively watching files, server startup, and automated request logging with status codes and latency.
![Terminal logs with nodemon](screenshots/terminal-nodemon.png)

---

## Notes: Problems Faced & Solutions

1. **JSON Body Parsing Issue in POST/PUT Requests:**
   - *Problem:* Initial POST requests resulted in `req.body` being `undefined`, throwing errors when accessing `req.body.title`.
   - *Solution:* Added `app.use(express.json())` middleware before defining route handlers so that incoming `application/json` payloads are parsed into standard JavaScript objects.

2. **Preventing Port Conflicts and Unconnected Queries:**
   - *Problem:* Starting `app.listen()` outside the async database initialization resulted in queries being executed before `db` was initialized, causing crashes.
   - *Solution:* Placed `app.listen()` inside `initializeDBAndServer()` strictly after `await open({...})` resolves.

3. **Handling Non-Existent Records on Update and Delete:**
   - *Problem:* Executing `UPDATE` or `DELETE` for a non-existent `bookId` in SQLite does not throw an error; it simply affects 0 rows, which could deceptively return a `200 OK`.
   - *Solution:* Checked `dbResponse.changes === 0`. If no rows were affected, the server explicitly returns a `404 Not Found` error response.

---

## Viva Questions & Answers

### 1. Why await the database call?
- Database queries (reading from disk, executing SQL, waiting for transaction locks) are asynchronous I/O operations that take time.
- In Node.js, asynchronous operations return Promises. Using `await` pauses the execution of the asynchronous function until the database query resolves and returns the data.
- Without `await`, the code would immediately proceed with an unresolved Promise object, resulting in empty responses or `undefined` data being sent back to the client.

### 2. What is SQL injection and how do placeholders prevent it?
- **SQL Injection (SQLi)** is a critical security vulnerability where untrusted client input is concatenated directly into a raw SQL query string. An attacker can inject malicious SQL commands (e.g., `' OR '1'='1'; DROP TABLE book; --`) to bypass authentication, read confidential data, or destroy tables.
- **How Placeholders (`?`) Prevent SQLi:**  
  When using placeholders (`?`), the database engine uses **Prepared Statements**. The SQL query structure is compiled and parsed first. Then, user inputs are transmitted separately as literal data parameters, never as executable code. Even if a user enters malicious SQL keywords or quotation marks, the database engine treats them strictly as plain text values, completely eliminating injection attacks.

### 3. When is PUT used instead of POST?
- **POST** is used when **creating** a new resource where the server decides the identifier (`id`), or when performing non-idempotent operations (submitting forms, processing payments). Calling POST multiple times with the same data will create multiple duplicate records.
- **PUT** is used when **updating or replacing** an existing resource at a known URI (e.g., `/books/:bookId/`). PUT is **idempotent**: executing the identical PUT request once or ten times in succession produces the exact same final state on the server without creating extra records.
