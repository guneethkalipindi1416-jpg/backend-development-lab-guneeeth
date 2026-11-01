/**
 * Database Seed Script for Lab 2
 * Creates the 'book' table and populates it with 10 sample books.
 */

const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const dbPath = path.join(__dirname, 'goodreads.db');

const initialBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 450, pages: 180 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 520, pages: 281 },
  { id: 3, title: '1984', author: 'George Orwell', price: 399, pages: 328 },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 350, pages: 279 },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 420, pages: 214 },
  { id: 6, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 599, pages: 310 },
  { id: 7, title: 'Fahrenheit 451', author: 'Ray Bradbury', price: 380, pages: 249 },
  { id: 8, title: 'Brave New World', author: 'Aldous Huxley', price: 410, pages: 268 },
  { id: 9, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', price: 650, pages: 671 },
  { id: 10, title: 'The Alchemist', author: 'Paulo Coelho', price: 299, pages: 208 }
];

async function seedDatabase() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log(`Connected to database at ${dbPath}`);

    // Drop table if exists to ensure clean seed state
    await db.exec(`DROP TABLE IF EXISTS book;`);

    // Create table schema
    await db.exec(`
      CREATE TABLE book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);
    console.log(`Created 'book' table successfully.`);

    // Insert 10 rows using parameterized query placeholders (?)
    const insertQuery = `
      INSERT INTO book (id, title, author, price, pages)
      VALUES (?, ?, ?, ?, ?);
    `;

    for (const b of initialBooks) {
      await db.run(insertQuery, [b.id, b.title, b.author, b.price, b.pages]);
    }

    console.log(`Seeded ${initialBooks.length} books into the 'book' table successfully.`);
    const countResult = await db.get(`SELECT COUNT(*) AS total FROM book;`);
    console.log(`Total rows in 'book' table: ${countResult.total}`);

    await db.close();
    console.log(`Database connection closed.`);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
}

seedDatabase();
