const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload lens product with image
router.post('/upload-lens', upload.single('image'), async (req, res) => {
  try {
    const { name, brand, price, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description, stock } = req.body;

    // Validate required fields
    if (!name || !brand || !price || !type) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Name, brand, price, and type are required' });
    }

    // Get image URL if file was uploaded
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
      INSERT INTO lens_products 
      (name, brand, price, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description, stock, image_url, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(query, [
      name,
      brand,
      price,
      type,
      power_range || null,
      color || null,
      frame_material || null,
      coating_type || null,
      collection || null,
      gender_category || null,
      product_category || null,
      description || null,
      stock || 0,
      image_url
    ]);

    res.status(201).json({
      success: true,
      message: 'Lens product uploaded successfully',
      productId: result.insertId,
      imageUrl: image_url
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload lens product', details: error.message });
  }
});

// Get all lens products
router.get('/get-lens', async (req, res) => {
  try {
    const query = 'SELECT * FROM lens_products ORDER BY created_at DESC';
    const [products] = await pool.query(query);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch lens products', details: error.message });
  }
});

// Get single lens product by ID
router.get('/get-lens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM lens_products WHERE id = ?';
    const [products] = await pool.query(query, [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product: products[0] });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch lens product', details: error.message });
  }
});

// Get lens by type filter
router.get('/get-lens-by-type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const query = 'SELECT * FROM lens_products WHERE type = ? ORDER BY created_at DESC';
    const [products] = await pool.query(query, [type]);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch lens products', details: error.message });
  }
});

// Update lens product with optional image
router.put('/update-lens/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description, stock } = req.body;

    // Get existing product to check current image
    const [existingProduct] = await pool.query('SELECT image_url FROM lens_products WHERE id = ?', [id]);

    if (existingProduct.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Product not found' });
    }

    // Use new image if uploaded, otherwise keep existing
    let image_url = existingProduct[0].image_url;
    if (req.file) {
      // Delete old image if it exists
      if (existingProduct[0].image_url) {
        const oldImagePath = path.join(__dirname, '../', existingProduct[0].image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const query = `
      UPDATE lens_products 
      SET name = ?, brand = ?, price = ?, type = ?, power_range = ?, color = ?, frame_material = ?, coating_type = ?, collection = ?, gender_category = ?, product_category = ?, description = ?, stock = ?, image_url = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, [
      name,
      brand,
      price,
      type,
      power_range,
      color,
      frame_material,
      coating_type,
      collection,
      gender_category,
      product_category,
      description,
      stock,
      image_url,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Lens product updated successfully', imageUrl: image_url });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update lens product', details: error.message });
  }
});

// Delete lens product and image
router.delete('/delete-lens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product to find image
    const [products] = await pool.query('SELECT image_url FROM lens_products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image file if it exists
    if (products[0].image_url) {
      const imagePath = path.join(__dirname, '../', products[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const query = 'DELETE FROM lens_products WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Lens product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete lens product', details: error.message });
  }
});

// Checkout: create order and order items
router.post('/checkout', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { customer, items } = req.body; // customer: { name, email, phone, address }
    if (!customer || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid checkout payload' });
    }

    // calculate total
    let total = 0;
    for (const it of items) {
      const qty = parseInt(it.quantity || 0, 10);
      const price = parseFloat(it.price || 0);
      total += qty * price;
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (customer_name, email, phone, address, total_amount, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [customer.name || null, customer.email || null, customer.phone || null, customer.address || null, total]
    );

    const orderId = orderResult.insertId;

    for (const it of items) {
      const productId = (it.id && parseInt(it.id, 10)) || null;
      const name = it.name || null;
      const price = parseFloat(it.price || 0);
      const quantity = parseInt(it.quantity || 0, 10);
      const subtotal = price * quantity;

      // Only insert if we have a valid product_id, otherwise set to NULL
      let validProductId = null;
      if (productId) {
        // Verify the product exists
        const [checkProduct] = await connection.execute(
          `SELECT id FROM lens_products WHERE id = ?`,
          [productId]
        );
        if (checkProduct.length > 0) {
          validProductId = productId;
        }
      }

      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, validProductId, name, price, quantity, subtotal]
      );

      // decrement stock if product id is valid
      if (validProductId) {
        await connection.execute(
          `UPDATE lens_products SET stock = GREATEST(stock - ?, 0) WHERE id = ?`,
          [quantity, validProductId]
        );
      }
    }

    await connection.commit();
    connection.release();
    res.json({ success: true, orderId });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed', details: err.message });
  }
});

// Admin: list orders (with basic summary)
router.get('/orders', async (req, res) => {
  try {
    const query = `SELECT id, customer_name, email, phone, total_amount, created_at FROM orders ORDER BY id DESC`;
    const [orders] = await pool.query(query);
    res.json({ success: true, orders: orders || [] });
  } catch (err) {
    console.error('List orders error:', err);
    res.status(500).json({ success: false, error: 'Failed to list orders', details: err.message });
  }
});

// Admin: get order details including items
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid order ID' });
    }

    const [orders] = await pool.query('SELECT id, customer_name, email, phone, address, total_amount, created_at FROM orders WHERE id = ?', [id]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const [items] = await pool.query('SELECT product_id, name, price, quantity, subtotal FROM order_items WHERE order_id = ?', [id]);
    res.json({ success: true, order: orders[0], items: items || [] });
  } catch (err) {
    console.error('Order detail error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch order details', details: err.message });
  }
});

// Add to wishlist
router.post('/wishlist/add', async (req, res) => {
  try {
    const { product_id, product_name, brand, price, image_url, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Get product details if not provided
    let name = product_name;
    let productBrand = brand;
    let productPrice = price;
    let productImage = image_url;
    let productType = type;
    let productPowerRange = power_range;
    let productColor = color;
    let productFrameMaterial = frame_material;
    let productCoatingType = coating_type;
    let productCollection = collection;
    let productGenderCategory = gender_category;
    let productCategory = product_category;
    let productDescription = description;

    if (!name) {
      const [products] = await pool.query('SELECT name, brand, price, image_url, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description FROM lens_products WHERE id = ?', [product_id]);
      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const product = products[0];
      name = product.name;
      productBrand = product.brand;
      productPrice = product.price;
      productImage = product.image_url;
      productType = product.type;
      productPowerRange = product.power_range;
      productColor = product.color;
      productFrameMaterial = product.frame_material;
      productCoatingType = product.coating_type;
      productCollection = product.collection;
      productGenderCategory = product.gender_category;
      productCategory = product.product_category;
      productDescription = product.description;
    }

    // Add to wishlist (will ignore if duplicate due to UNIQUE constraint)
    const query = `
      INSERT INTO wishlist (product_id, product_name, brand, price, image_url, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
    `;

    await pool.execute(query, [
      product_id,
      name,
      productBrand,
      productPrice,
      productImage,
      productType,
      productPowerRange,
      productColor,
      productFrameMaterial,
      productCoatingType,
      productCollection,
      productGenderCategory,
      productCategory,
      productDescription
    ]);

    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Wishlist add error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist', details: error.message });
  }
});

// Remove from wishlist
router.delete('/wishlist/remove/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM wishlist WHERE product_id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Wishlist remove error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist', details: error.message });
  }
});

// Get all wishlist items
router.get('/wishlist', async (req, res) => {
  try {
    const query = 'SELECT id, product_id, product_name, brand, price, image_url, type, power_range, color, frame_material, coating_type, collection, gender_category, product_category, description, created_at FROM wishlist ORDER BY created_at DESC';
    const [items] = await pool.query(query);

    res.json({ success: true, items });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist', details: error.message });
  }
});

// Check if product is in wishlist
router.get('/wishlist/check/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT id FROM wishlist WHERE product_id = ?';
    const [items] = await pool.query(query, [id]);

    res.json({ success: true, inWishlist: items.length > 0 });
  } catch (error) {
    console.error('Wishlist check error:', error);
    res.status(500).json({ error: 'Failed to check wishlist', details: error.message });
  }
});

module.exports = router;
