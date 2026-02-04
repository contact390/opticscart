# Lens Product Upload System - Setup Guide

## Files Created

### 1. **Frontend Pages**
- `upload-lens.html` - Form to upload/add new lens products with detailed information
- `products.html` - Display all uploaded products with filtering and search capabilities

### 2. **Backend Routes**
- `routes/lens.js` - API endpoints for lens CRUD operations

### 3. **Database Setup**
- `setup-database.js` - Script to create the lens_products table

---

## Setup Instructions

### Step 1: Create the Database Table

Run this command in your terminal to create the required database table:

```bash
node setup-database.js
```

**What this does:**
- Creates `lens_products` table in your `hitaishilens` database
- Sets up all required fields (name, brand, price, type, power_range, color, description, stock, image_url)
- Adds timestamps for tracking creation and updates
- Creates indexes for better query performance

---

### Step 2: Start the Server

```bash
node server.js
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Database table created successfully!
```

---

## Using the System

### Upload a Lens Product

1. Go to: `http://localhost:5000/upload-lens.html`
2. Fill in the form with:
   - **Product Name** - Name of the lens (required)
   - **Brand** - Brand name like Ray-Ban, John Jacobs (required)
   - **Price** - Price in rupees (required)
   - **Type** - Single Vision, Bifocal, Progressive, Contact Lens, Sunglasses, Computer Glasses, Photochromic (required)
   - **Power Range** - Optional (e.g., -5.00 to +5.00)
   - **Color** - Optional (e.g., Clear, Brown, Blue)
   - **Stock** - Quantity available (default: 0)
   - **Image URL** - Link to product image (optional)
   - **Description** - Detailed description (optional)
3. Click "Upload Product"
4. You'll be redirected to the products page

### View All Products

1. Go to: `http://localhost:5000/products.html`
2. View all uploaded lens products
3. Use filters to view by type (Single Vision, Bifocal, etc.)
4. Click on a product to see full details in a modal

---

## API Endpoints

### Upload Lens Product
**POST** `/api/upload-lens`
```json
{
  "name": "Crystal Clear Lens",
  "brand": "Ray-Ban",
  "price": 2500,
  "type": "Single Vision",
  "power_range": "-5.00 to +5.00",
  "color": "Clear",
  "stock": 100,
  "image_url": "https://example.com/image.jpg",
  "description": "Premium quality lens"
}
```

### Get All Lens Products
**GET** `/api/get-lens`

### Get Lens Product by ID
**GET** `/api/get-lens/:id`

### Get Lens by Type
**GET** `/api/get-lens-by-type/:type`

### Update Lens Product
**PUT** `/api/update-lens/:id`

### Delete Lens Product
**DELETE** `/api/delete-lens/:id`

---

## Database Table Structure

```sql
lens_products
├── id (INT, Auto-increment, Primary Key)
├── name (VARCHAR 255, Required)
├── brand (VARCHAR 100, Required)
├── price (DECIMAL 10,2, Required)
├── type (VARCHAR 100, Required)
├── power_range (VARCHAR 100)
├── color (VARCHAR 100)
├── description (TEXT)
├── stock (INT, Default: 0)
├── image_url (VARCHAR 500)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── Indexes: type, brand, created_at
```

---

## Features

✅ **Upload Form**
- Responsive design
- Form validation
- Loading states
- Success/Error messages
- Auto-redirect to products page after upload

✅ **Products Display**
- Grid layout (auto-responsive)
- Filter by product type
- Product cards with key information
- Modal for detailed view
- Stock level indicator (shows warning for low stock)

✅ **Backend**
- CRUD operations (Create, Read, Update, Delete)
- Error handling
- Database validation
- RESTful API design

---

## Troubleshooting

**Q: Getting "Table does not exist" error?**
A: Run `node setup-database.js` to create the table

**Q: Products not loading?**
A: Check if server is running on port 5000
Make sure MySQL is running
Check browser console for errors (F12)

**Q: Image not showing?**
A: Ensure the image URL is valid and accessible from your browser

**Q: CORS Error?**
A: The server already has CORS enabled, make sure you're accessing via http://localhost:5000

---

## Next Steps

1. ✅ Create database table: `node setup-database.js`
2. ✅ Start server: `node server.js`
3. ✅ Upload a product: http://localhost:5000/upload-lens.html
4. ✅ View products: http://localhost:5000/products.html

Enjoy your lens management system! 🕶️
