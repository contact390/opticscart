const express = require('express');
const cors = require('cors');
const path = require('path');

const registerRoutes = require('./routes/register');
const contactRoutes = require('./routes/contact');
const lensRoutes = require('./routes/lens');
const cartRoutes = require('./routes/cart');

const app = express();

// ✅ CORS
app.use(cors());

// ✅ FIX 413 ERROR (IMPORTANT)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ✅ Static Frontend Files
app.use(express.static(path.join(__dirname)));

// ✅ Static Upload Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Routes
app.use('/api', registerRoutes);
app.use('/api', contactRoutes);
app.use('/api', lensRoutes);
app.use('/api', cartRoutes);

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: "OK" });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "File too large (Max 20MB allowed)"
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});