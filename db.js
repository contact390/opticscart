const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  user: "opticsuser",          // <-- replace root
  password: "StrongPass@123",  // <-- your MySQL password
  database: "hitaishilens",    // <-- your database
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
