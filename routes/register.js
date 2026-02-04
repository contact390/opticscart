const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

/* 🔹 Create table if not exists */
(async () => {
  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50),
      phone VARCHAR(15),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  conn.release();
  console.log('✅ users table ready');
})();

/* 🔹 Signup API */
router.post('/signup', async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO users (firstName, lastName, phone, email, password)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, phone, email, hashedPassword]
    );
    conn.release();

    res.status(201).json({ message: 'Account created successfully' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


const jwt = require('jsonwebtoken');

/* 🔹 LOGIN API */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      'SELECT id, firstName, email, password FROM users WHERE email = ?',
      [email]
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      'SECRET_KEY_123',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
