const pool = require('./db');

async function populateCategories() {
  try {
    console.log('🔄 Populating product categories...');
    
    await pool.execute('UPDATE lens_products SET product_category = ? WHERE id <= 17 LIMIT 17', ['Eye Glasses']);
    console.log('✅ Updated 17 products to Eye Glasses');
    
    await pool.execute('UPDATE lens_products SET product_category = ? WHERE id > 17 AND id <= 35 LIMIT 18', ['Sunglasses']);
    console.log('✅ Updated 18 products to Sunglasses');
    
    await pool.execute('UPDATE lens_products SET product_category = ? WHERE id > 35', ['Contact Lenses']);
    console.log('✅ Updated remaining products to Contact Lenses');
    
    const [result] = await pool.execute('SELECT COUNT(*) as total, SUM(IF(product_category IS NOT NULL, 1, 0)) as with_category FROM lens_products');
    const row = result[0];
    console.log(`\n📊 Final Count: ${row.with_category} of ${row.total} products have categories`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateCategories();
