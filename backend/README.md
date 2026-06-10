# Luxe Estate Backend API

Backend API for Luxe Estate Real Estate Portal built with Node.js, Express, and MongoDB.

## Features

- **Property Management**: CRUD operations for luxury properties
- **User Authentication**: JWT-based authentication system
- **Contact Forms**: Lead generation with email notifications
- **Newsletter System**: Subscribe/unsubscribe functionality
- **Advanced Search**: Search and filter properties by various criteria
- **Rate Limiting**: API protection against abuse
- **Security**: Helmet, CORS, and input validation

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties with filtering and pagination
- `GET /api/properties/:id` - Get single property by ID
- `GET /api/properties/featured/featured` - Get featured properties
- `GET /api/properties/types/list` - Get property types for filtering
- `GET /api/properties/price-range/range` - Get price range for filtering

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin only)
- `GET /api/contacts/:id` - Get single contact
- `PUT /api/contacts/:id/status` - Update contact status

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/status/:email` - Check subscription status

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/luxe-estate
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@luxe-estate.com
```

### 3. Database Setup
Make sure MongoDB is running on your system.

### 4. Initialize Sample Data
```bash
npm run init-data
```

This will create sample properties and test users.

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Sample Users

After running `npm run init-data`, you can use these test credentials:

**Admin User**
- Email: admin@luxe-estate.com
- Password: admin123

**Agent User**
- Email: agent@luxe-estate.com
- Password: agent123

## Email Configuration

For email functionality (contact forms and newsletter), you need to configure SMTP settings. For Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use the app password in the `EMAIL_PASS` variable

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

For errors:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Search and Filter Parameters

### Properties
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction (default: desc)
- `location` - City search
- `propertyType` - Property type filter
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minBedrooms` - Minimum bedrooms
- `minBathrooms` - Minimum bathrooms
- `amenities` - Comma-separated amenities
- `search` - General search term

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS protection
- Input validation with express-validator
- SQL injection protection via Mongoose ODM

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **nodemailer** - Email sending
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **compression** - Response compression
- **express-rate-limit** - Rate limiting

## Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection
│   └── initData.js          # Sample data initialization
├── models/
│   ├── Property.js          # Property model
│   ├── User.js             # User model
│   └── Contact.js          # Contact model
├── routes/
│   ├── properties.js        # Property routes
│   ├── auth.js             # Authentication routes
│   ├── contacts.js         # Contact form routes
│   └── newsletter.js      # Newsletter routes
├── package.json
├── server.js               # Main server file
└── .env                    # Environment variables
```

## Development

For development, install nodemon for auto-reloading:

```bash
npm install --save-dev nodemon
npm run dev
```

## License

MIT License - see LICENSE file for details.