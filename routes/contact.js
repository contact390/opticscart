const express = require("express");
const router = express.Router();
const pool = require("../db");

/* ✅ CREATE TABLE */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(150),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ contact_messages table ready");
  } catch (err) {
    console.error("❌ Table creation error:", err);
  }
})();

/* ✅ CONTACT API */
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await pool.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );

    res.json({ success: true, message: "Message saved" });

  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
