const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '2001',      // add your MySQL password
  database: 'hitaishilens',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
