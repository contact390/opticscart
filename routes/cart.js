const express = require('express');
const router = express.Router();
const db = require('../db');

// Initialize cart table - without foreign key on lenses (which might not exist yet)
async function initCartTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_product (user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ cart table ready');
    } catch (error) {
        console.error('Error creating cart table:', error.message);
    }
}

// Initialize wishlist table - without foreign key on lenses (which might not exist yet)
async function initWishlistTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_product (user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ wishlist table ready');
    } catch (error) {
        console.error('Error creating wishlist table:', error.message);
    }
}

// Initialize tables on startup
initCartTable();
initWishlistTable();

// Middleware to verify user authentication
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'SECRET_KEY_123');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

// ==================== CART ENDPOINTS ====================

// Add to cart
router.post('/cart/add', verifyToken, async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const user_id = req.user.id;

        if (!product_id) {
            return res.status(400).json({ success: false, message: 'Product ID required' });
        }

        // Try to insert or update without checking lenses table
        const result = await db.query(
            `INSERT INTO cart (user_id, product_id, quantity) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [user_id, product_id, quantity, quantity]
        );

        res.json({ 
            success: true, 
            message: 'Product added to cart',
            cartId: result[0].insertId 
        });
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});

// Get cart items
router.get('/cart', verifyToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        // Get cart without joining lenses table
        const [cartItems] = await db.query(`
            SELECT 
                c.id,
                c.product_id,
                c.quantity,
                c.created_at
            FROM cart c
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `, [user_id]);

        res.json({ 
            success: true, 
            cart: cartItems,
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching cart' });
    }
});

// Update cart item quantity
router.put('/cart/:cartId', verifyToken, async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity } = req.body;
        const user_id = req.user.id;

        if (quantity <= 0) {
            // Delete if quantity is 0 or less
            await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, user_id]);
            return res.json({ success: true, message: 'Item removed from cart' });
        }

        const result = await db.query(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, cartId, user_id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error.message);
        res.status(500).json({ success: false, message: 'Error updating cart' });
    }
});

// Remove item from cart
router.delete('/cart/:cartId', verifyToken, async (req, res) => {
    try {
        const { cartId } = req.params;
        const user_id = req.user.id;

        const result = await db.query(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [cartId, user_id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error.message);
        res.status(500).json({ success: false, message: 'Error removing from cart' });
    }
});

// Clear entire cart
router.delete('/cart', verifyToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        await db.query('DELETE FROM cart WHERE user_id = ?', [user_id]);

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        res.status(500).json({ success: false, message: 'Error clearing cart' });
    }
});

// ==================== WISHLIST ENDPOINTS ====================

// Add to wishlist
router.post('/wishlist/add', verifyToken, async (req, res) => {
    try {
        const { product_id } = req.body;
        const user_id = req.user.id;

        if (!product_id) {
            return res.status(400).json({ success: false, message: 'Product ID required' });
        }

        // Check if already in wishlist
        const [existing] = await db.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        if (existing.length > 0) {
            return res.json({ success: true, message: 'Already in wishlist', alreadyExists: true });
        }

        // Add to wishlist
        const result = await db.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [user_id, product_id]
        );

        res.json({ 
            success: true, 
            message: 'Added to wishlist',
            wishlistId: result[0].insertId 
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error.message);
        res.status(500).json({ success: false, message: 'Error adding to wishlist' });
    }
});

// Get wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        const [wishlistItems] = await db.query(`
            SELECT 
                w.id,
                w.product_id,
                w.created_at
            FROM wishlist w
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `, [user_id]);

        res.json({ 
            success: true, 
            wishlist: wishlistItems,
            totalItems: wishlistItems.length
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching wishlist' });
    }
});

// Check if product is in wishlist
router.get('/wishlist/check/:product_id', verifyToken, async (req, res) => {
    try {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const [result] = await db.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        res.json({ 
            success: true, 
            inWishlist: result.length > 0,
            wishlistId: result.length > 0 ? result[0].id : null
        });
    } catch (error) {
        console.error('Error checking wishlist:', error.message);
        res.status(500).json({ success: false, message: 'Error checking wishlist' });
    }
});

// Remove from wishlist
router.delete('/wishlist/:wishlistId', verifyToken, async (req, res) => {
    try {
        const { wishlistId } = req.params;
        const user_id = req.user.id;

        const result = await db.query(
            'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
            [wishlistId, user_id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Wishlist item not found' });
        }

        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error.message);
        res.status(500).json({ success: false, message: 'Error removing from wishlist' });
    }
});

// Remove from wishlist by product ID
router.delete('/wishlist/product/:product_id', verifyToken, async (req, res) => {
    try {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const result = await db.query(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Wishlist item not found' });
        }

        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error.message);
        res.status(500).json({ success: false, message: 'Error removing from wishlist' });
    }
});

module.exports = router;
