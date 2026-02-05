const mysql = require('mysql2/promise');

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "opticsuser",
  password: "StrongPass@123",
  database: "hitaishilens",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
module.exports = pool;
