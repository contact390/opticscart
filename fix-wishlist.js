const pool = require('./db');

async function fixWishlistTable() {
  try {
    console.log('🔄 Checking and fixing wishlist table...');

    const connection = await pool.getConnection();
    
    // Check if wishlist table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'wishlist'");
    
    if (tables.length === 0) {
      console.log('❌ Wishlist table not found. Creating...');
      
      const createWishlist = `
        CREATE TABLE wishlist (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          product_name VARCHAR(255),
          brand VARCHAR(100),
          type VARCHAR(100),
          price DECIMAL(10,2),
          image_url VARCHAR(500),
          power_range VARCHAR(100),
          color VARCHAR(100),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_product (product_id),
          FOREIGN KEY (product_id) REFERENCES lens_products(id) ON DELETE CASCADE
        )
      `;
      
      await connection.execute(createWishlist);
      console.log('✅ Wishlist table created successfully!');
    } else {
      console.log('✅ Wishlist table already exists.');
      
      // Check if table has all required columns
      const [columns] = await connection.query("DESCRIBE wishlist");
      const columnNames = columns.map(col => col.Field);
      
      const requiredColumns = ['product_id', 'product_name', 'brand', 'type', 'price', 'image_url', 'power_range', 'color', 'description', 'created_at'];
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('⚠️ Missing columns:', missingColumns);
        console.log('Attempting to add missing columns...');
        
        if (!columnNames.includes('type')) {
          await connection.execute('ALTER TABLE wishlist ADD COLUMN type VARCHAR(100)');
          console.log('✅ Added type column');
        }
        if (!columnNames.includes('power_range')) {
          await connection.execute('ALTER TABLE wishlist ADD COLUMN power_range VARCHAR(100)');
          console.log('✅ Added power_range column');
        }
        if (!columnNames.includes('color')) {
          await connection.execute('ALTER TABLE wishlist ADD COLUMN color VARCHAR(100)');
          console.log('✅ Added color column');
        }
        if (!columnNames.includes('description')) {
          await connection.execute('ALTER TABLE wishlist ADD COLUMN description TEXT');
          console.log('✅ Added description column');
        }
      } else {
        console.log('✅ All required columns exist!');
      }
    }
    
    connection.release();
    console.log('\n✅ Wishlist table setup complete!');
    console.log('\nNow run: node server.js');
    
  } catch (error) {
    console.error('❌ Error setting up wishlist table:', error);
  }
  
  process.exit(0);
}

fixWishlistTable();
