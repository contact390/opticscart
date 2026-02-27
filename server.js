const express = require('express');
const cors = require('cors');
const path = require('path');

const registerRoutes = require('./routes/register');
const contactRoutes = require('./routes/contact');
const lensRoutes = require('./routes/lens');
const cartRoutes = require('./routes/cart');







const app = express();

app.use(cors());
app.use(express.json());

// parse URL-encoded bodies (for form posts if any)
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML/JS/CSS) from project root so pages load from backend
app.use(express.static(path.join(__dirname)));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount register routes (signup/login) and contact routes under /api
// log incoming requests for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

app.use('/api', registerRoutes);
app.use('/api', contactRoutes);
app.use('/api', lensRoutes);
app.use('/api', cartRoutes);


// health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on https://opticscart.com:${PORT}`);
});

// 404 handler (useful when frontend gets 404)
app.use((req, res) => {
  console.warn('404 for', req.method, req.originalUrl);
  res.status(404).json({ error: 'Not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});
