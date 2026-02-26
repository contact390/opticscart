# Form Integration - Request Information

## Overview
A complete form submission system has been implemented with frontend validation, backend processing, and admin management panel.

## Files Created/Modified

### 1. **Frontend - example3.html**
- Beautiful form with gradient background
- Form fields:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Venue Type (required) - Dropdown with options
  - Message (required)
- Features:
  - Real-time field validation
  - Error messages for each field
  - Success/error notifications
  - Loading state during submission
  - Responsive design

### 2. **Backend - routes/request.js** (NEW)
API endpoints for handling form submissions:

#### POST /api/request-information
Submit a new information request
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "venueType": "beachfront",
  "message": "I'm interested in more information about your services"
}
```

Response:
```javascript
{
  "success": true,
  "message": "Thank you! Your information request has been submitted successfully.",
  "requestId": 1
}
```

#### GET /api/requests
Get all information requests (Admin)

#### PUT /api/requests/:id
Update request status (Admin)
```javascript
{
  "status": "contacted" // pending, contacted, completed, rejected
}
```

#### DELETE /api/requests/:id
Delete a request (Admin)

### 3. **Admin Panel - admin-requests.html** (NEW)
Management dashboard showing:
- Statistics (Total, Pending, Contacted, Completed)
- Filter requests by status
- View request details
- Update status
- Delete requests
- Responsive table layout

### 4. **Database Table - information_requests**
Automatically created with fields:
- id (Primary Key)
- name (VARCHAR 100)
- email (VARCHAR 100)
- phone (VARCHAR 20)
- venue_type (VARCHAR 50)
- message (TEXT)
- status (pending/contacted/completed/rejected)
- created_at (Timestamp)
- updated_at (Timestamp)

### 5. **Server Configuration - server.js**
Updated to include the new request routes

## How to Use

### 1. Fill Out the Form
Navigate to `http://localhost:5000/example3.html`
- Fill in all required fields
- Click "Request Information"

### 2. View Submissions (Admin)
Navigate to `http://localhost:5000/admin-requests.html`
- See all submitted requests
- Filter by status
- Click "View" to see full details
- Update status or delete requests

## Validation Rules

### Frontend Validation
- **Name**: Minimum 2 characters
- **Email**: Valid email format (xxx@xxx.xxx)
- **Phone**: Valid phone number format (optional)
- **Venue Type**: Must select one option
- **Message**: Minimum 10 characters

### Backend Validation
Same rules enforced on server for security

## Form Submission Flow

1. User fills form on example3.html
2. JavaScript validates all fields
3. If valid, sends POST request to `/api/request-information`
4. Backend validates again and saves to database
5. Success message displayed to user
6. Form is reset
7. Admin can view in admin-requests.html

## Email Functionality (Optional)

The system includes email support using nodemailer. To enable:

1. Install nodemailer (already in package.json)
2. Set environment variables:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
3. Users will receive confirmation emails

## Error Handling

- Validates required fields
- Shows specific error messages
- Displays success/error notifications
- Handles server connection errors
- Prevents duplicate submissions during loading

## Features

✅ Form validation (frontend & backend)
✅ Database storage
✅ Admin management panel
✅ Real-time status updates
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Email notifications (optional)
✅ XSS protection (HTML escaping)

## Testing

1. Start the server: `node server.js`
2. Open form: `http://localhost:5000/example3.html`
3. Fill and submit
4. Check admin panel: `http://localhost:5000/admin-requests.html`
5. Update status and refresh

## Troubleshooting

**"Failed to submit the form"**
- Make sure server is running on http://localhost:5000
- Check browser console for errors
- Verify database connection

**Email not sending**
- Email functionality is optional
- Form will still work without email
- Check EMAIL_USER and EMAIL_PASSWORD env vars

**Database errors**
- Ensure MySQL is running
- Check database connection in db.js
- Table will auto-create on first request

## Future Enhancements

- Add file upload capability
- Implement email templates
- Add auto-reply from admin
- SMS notifications
- Advanced filtering/search
- Export to CSV
- Analytics dashboard
