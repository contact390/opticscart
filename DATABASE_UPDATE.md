# Important: Database Migration Required

Due to updates to the wishlist functionality, you need to update your database table.

## Step 1: Drop the old wishlist table (if it exists)

Run this in MySQL:

```sql
DROP TABLE IF EXISTS wishlist;
```

## Step 2: Run the database setup again

Run this command in your terminal:

```bash
node setup-database.js
```

This will create the new `wishlist` table with support for storing complete product information (type, power_range, color, description).

## Step 3: Restart the server

```bash
node server.js
```

---

## What Changed

The wishlist table now stores:
- ✅ `product_id` - Product ID
- ✅ `product_name` - Full product name
- ✅ `brand` - Brand name
- ✅ `price` - Product price
- ✅ `image_url` - Product image
- ✅ `type` - Product type (NEW)
- ✅ `power_range` - Power range (NEW)
- ✅ `color` - Color (NEW)
- ✅ `description` - Description (NEW)

## How It Works Now

1. **Click Heart Icon** → Heart turns RED ❤️
2. **Product Saved** → Complete card info stored in database
3. **View Wishlist** → All details displayed on wishlist page
4. **Buy from Wishlist** → Full product info available for ordering
5. **Remove Item** → Click heart again or use Remove button

---

## Troubleshooting

**Error: "Table already exists"**
- Run: `DROP TABLE wishlist;` first
- Then: `node setup-database.js`

**Wishlist still showing incomplete data**
- Restart server: `node server.js`
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page

**Heart not turning red**
- Check browser console (F12) for errors
- Verify MySQL is running
- Check that setup-database.js was run successfully
