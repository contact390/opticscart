const pool = require('./db');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');

    // Create lens_products table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS lens_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        type VARCHAR(100) NOT NULL,
        power_range VARCHAR(100),
        color VARCHAR(100),
        frame_material VARCHAR(100),
        coating_type VARCHAR(100),
        collection VARCHAR(100),
        gender_category VARCHAR(100),
        product_category VARCHAR(100),
        description TEXT,
        stock INT DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_brand (brand),
        INDEX idx_collection (collection),
        INDEX idx_gender_category (gender_category),
        INDEX idx_product_category (product_category),
        INDEX idx_created_at (created_at)
      )
    `;

    const connection = await pool.getConnection();
    await connection.execute(createTableQuery);
    
    // Add new columns to existing lens_products table if they don't exist
    try {
      await connection.execute('ALTER TABLE lens_products ADD COLUMN frame_material VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      await connection.execute('ALTER TABLE lens_products ADD COLUMN coating_type VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }

    try {
      await connection.execute('ALTER TABLE lens_products ADD COLUMN collection VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }

    try {
      await connection.execute('ALTER TABLE lens_products ADD COLUMN gender_category VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }

    try {
      await connection.execute('ALTER TABLE lens_products ADD COLUMN product_category VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      await connection.execute('ALTER TABLE lens_products ADD COLUMN model_image_url VARCHAR(500)');
    } catch (e) {
      // Column might already exist
    }
    
    connection.release();

    // Create orders and order_items tables
    const createOrders = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        total_amount DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createOrderItems = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        name VARCHAR(255),
        price DECIMAL(10,2) DEFAULT 0,
        quantity INT DEFAULT 1,
        subtotal DECIMAL(10,2) DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `;

    const conn2 = await pool.getConnection();
    await conn2.execute(createOrders);
    await conn2.execute(createOrderItems);
    conn2.release();

    console.log('✅ Orders tables created: orders, order_items');

    // Create wishlist table
    const createWishlist = `
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        product_name VARCHAR(255),
        brand VARCHAR(100),
        type VARCHAR(100),
        price DECIMAL(10,2),
        image_url VARCHAR(500),
        power_range VARCHAR(100),
        color VARCHAR(100),
        frame_material VARCHAR(100),
        coating_type VARCHAR(100),
        collection VARCHAR(100),
        gender_category VARCHAR(100),
        product_category VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_product (product_id),
        FOREIGN KEY (product_id) REFERENCES lens_products(id) ON DELETE CASCADE
      )
    `;
    
    const conn3 = await pool.getConnection();
    await conn3.execute(createWishlist);
    
    // Add new columns to existing wishlist table if they don't exist
    try {
      await conn3.execute('ALTER TABLE wishlist ADD COLUMN frame_material VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      await conn3.execute('ALTER TABLE wishlist ADD COLUMN coating_type VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }

    try {
      await conn3.execute('ALTER TABLE wishlist ADD COLUMN collection VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }

    try {
      await conn3.execute('ALTER TABLE wishlist ADD COLUMN gender_category VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }

    try {
      await conn3.execute('ALTER TABLE wishlist ADD COLUMN product_category VARCHAR(100)');
    } catch (e) {
      // Column might already exist
    }
    
    conn3.release();

    console.log('✅ Wishlist table created: wishlist');

    console.log('✅ Database table created successfully!');
    console.log('📋 Table: lens_products');
    console.log('   - id (Primary Key)');
    console.log('   - name');
    console.log('   - brand');
    console.log('   - price');
    console.log('   - type');
    console.log('   - power_range');
    console.log('   - color');
    console.log('   - frame_material');
    console.log('   - coating_type');
    console.log('   - description');
    console.log('   - stock');
    console.log('   - image_url');
    console.log('   - created_at');
    console.log('   - updated_at');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }

  process.exit(0);
}

setupDatabase();
