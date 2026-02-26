# Quick Test Guide - Lens Upload System

## ✅ What's Been Set Up

### 1. **Database Table Created**
- Table: `lens_products` 
- Fields: id, name, brand, price, type, power_range, color, description, stock, image_url, created_at, updated_at

### 2. **Frontend Files**
- **upload-lens.html** - Beautiful form to add lens products
- **products.html** - Display all products with filtering

### 3. **Backend Routes**
- routes/lens.js - All API endpoints for lens management

### 4. **Server Updated**
- server.js - Now includes lens routes

---

## 🚀 How to Use

### Step 1: Start the Server
The server is already running on **http://localhost:5000**

If not running, execute:
```bash
node server.js
```

### Step 2: Access Upload Form
Open in browser:
```
http://localhost:5000/upload-lens.html
```

Fill in the form:
- Product Name: "Anti-Glare Lens"
- Brand: "Ray-Ban"
- Price: 1999
- Type: "Anti-Glare Lens" (or any from dropdown)
- Power Range: "-3.00 to +3.00"
- Color: "Clear"
- Stock: 50
- Image URL: (optional)
- Description: "Premium anti-glare coating"

Click **"Upload Product"** button

### Step 3: View Products
Open in browser:
```
http://localhost:5000/products.html
```

You'll see:
- All uploaded products in a grid layout
- Filter buttons by product type
- Product cards with price, stock, and details
- Click on any product to see full details

---

## 📡 API Endpoints (For Testing)

**Upload a product (POST):**
```bash
curl -X POST http://localhost:5000/api/upload-lens \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blue Light Filter",
    "brand": "John Jacobs",
    "price": 2500,
    "type": "Computer Glasses",
    "power_range": "-2.00 to +2.00",
    "color": "Blue",
    "stock": 30,
    "description": "Reduces blue light for screen time"
  }'
```

**Get all products (GET):**
```bash
curl http://localhost:5000/api/get-lens
```

**Get product by ID (GET):**
```bash
curl http://localhost:5000/api/get-lens/1
```

**Get by type (GET):**
```bash
curl http://localhost:5000/api/get-lens-by-type/Computer%20Glasses
```

---

## 📋 Form Fields Explained

| Field | Required | Example | Notes |
|-------|----------|---------|-------|
| Product Name | Yes | Crystal Clear Lens | Name of the lens |
| Brand | Yes | Ray-Ban | Brand name |
| Price | Yes | 2500 | In rupees (₹) |
| Type | Yes | Single Vision | Choose from dropdown |
| Power Range | No | -5.00 to +5.00 | Lens power range |
| Color | No | Clear | Color of lens |
| Stock | No | 100 | Quantity available |
| Image URL | No | https://... | Link to product image |
| Description | No | Premium quality | Detailed description |

---

## 🎨 Product Types Available

1. Single Vision
2. Bifocal
3. Progressive
4. Contact Lens
5. Sunglasses
6. Computer Glasses
7. Photochromic

---

## 🔍 Features

### Upload Page
✅ Clean, modern form design
✅ Form validation
✅ Loading indicators
✅ Success/Error messages
✅ Auto-redirect after upload

### Products Page
✅ Responsive grid layout
✅ Filter by type
✅ Product cards with info
✅ Modal for detailed view
✅ Stock indicators
✅ Formatted prices
✅ Hover effects

### Backend
✅ Create products
✅ Read products (all, by ID, by type)
✅ Update products
✅ Delete products
✅ Error handling
✅ Database timestamps

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Page not loading | Check if server is running on port 5000 |
| 404 error | Make sure correct URL is used (http://localhost:5000) |
| Database error | Run `node setup-database.js` |
| No products showing | Upload a product first from upload form |
| Image not displaying | Check if image URL is valid and accessible |

---

## ✨ Next Steps

1. ✅ Test the upload form: http://localhost:5000/upload-lens.html
2. ✅ Add a few sample products
3. ✅ View products: http://localhost:5000/products.html
4. ✅ Test filters by clicking product type buttons
5. ✅ Click on products to see details in modal

---

Enjoy your complete lens management system! 🕶️
