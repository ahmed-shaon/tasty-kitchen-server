
# Tasty Kitchen Server

A RESTful API backend for a food ordering and review platform. Built with Express.js and MongoDB, featuring JWT authentication for secure user operations.

## Overview

This server provides a complete backend solution for managing a food restaurant's menu and customer reviews. It enables clients to browse menu items, submit ratings and reviews, and manage their own review history with secure JWT-based authentication.

## Features

- **Menu Management** - Browse and retrieve food items with sorting capabilities
- **Review System** - Create, read, update, and delete customer reviews with ratings
- **JWT Authentication** - Secure endpoints with token-based authentication
- **CORS Enabled** - Cross-origin requests supported for frontend integration
- **MongoDB Integration** - Persistent data storage with MongoDB Atlas
- **Vercel Ready** - Pre-configured for serverless deployment

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB 4.11.0
- **Authentication:** JWT (jsonwebtoken 8.5.1)
- **Other:** CORS 2.8.5, dotenv 16.0.3

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## Installation & Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd tasty-kitchen-server
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DB_USER=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Server runs on `http://localhost:5000`

## Database Configuration

**Connection String:**
```
mongodb+srv://{DB_USER}:{DB_PASSWORD}@cluster0.4dokkij.mongodb.net/?retryWrites=true&w=majority
```

**Database:** `tastyKitchen`

**Collections:**
- `menu` - Food items/menu entries
- `reviews` - Customer reviews and ratings

## API Endpoints

### Menu Endpoints

#### GET `/menu`
Retrieve all menu items (sorted by newest first)

Query Parameters:
- `home` (optional) - If present, returns only 3 items for homepage display

Response: Array of menu items

---

#### GET `/menu/:id`
Retrieve a specific menu item by ID

Parameters:
- `id` - MongoDB ObjectId of the menu item

Response: Single menu item object

---

#### POST `/menu`
Add a new menu item

Request Body:
```json
{
  "name": "Item Name",
  "description": "Description",
  "price": 9.99,
  "category": "Category",
  "image": "image_url"
}
```

Response: `{ acknowledged: true, insertedId: ObjectId }`

---

### Review Endpoints

#### GET `/reviewsbyid`
Get all reviews for a specific menu item (public, no auth required)

Query Parameters:
- `id` - Menu item ID

Response: Array of reviews for that item

---

#### GET `/reviews`
Get all reviews by the authenticated user (JWT protected)

Query Parameters:
- `email` - User's email address

Headers:
```
Authorization: Bearer {JWT_TOKEN}
```

Response: Array of user's reviews

---

#### POST `/review`
Submit a new review

Request Body:
```json
{
  "itemId": "menu_item_id",
  "email": "user@example.com",
  "rating": 5,
  "message": "Great food!",
  "date": "2024-01-28"
}
```

Response: `{ acknowledged: true, insertedId: ObjectId }`

---

#### PUT `/reviews/:id`
Update an existing review (authenticated user only)

Parameters:
- `id` - Review ID

Request Body:
```json
{
  "rating": 4,
  "message": "Updated review message"
}
```

Response: `{ acknowledged: true, modifiedCount: 1 }`

---

#### DELETE `/reviews/:id`
Delete a review (authenticated user only)

Parameters:
- `id` - Review ID

Response: `{ acknowledged: true, deletedCount: 1 }`

---

### Authentication Endpoint

#### POST `/jwt`
Generate a JWT token for a user

Request Body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token expiry:** 10 hours

---

### Health Check

#### GET `/`
Simple endpoint to verify server is running

Response: `khub-tast server is running.`

## Authentication

The server uses JWT (JSON Web Tokens) for authentication:

1. Call `/jwt` endpoint with user email to get a token
2. Include token in subsequent requests: `Authorization: Bearer {token}`
3. Server verifies token validity before processing protected endpoints
4. Tokens expire after 10 hours

Protected endpoints:
- `GET /reviews` - Get user's own reviews

## Database Schema

### Menu Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Item name
  description: String,       // Item description
  price: Number,            // Price in USD
  image: String,            // Image URL
  category: String,         // Food category
  createdAt: Date           // (optional) Creation date
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,
  itemId: String,           // Reference to menu item ID
  email: String,            // Reviewer's email
  rating: Number,           // Rating (1-5)
  message: String,          // Review text
  date: String/Date,        // Review submission date
  createdAt: Date           // (optional) Creation timestamp
}
```

## Running the Server

### Development
```bash
npm start
```

### Production (Vercel)
The project is configured for Vercel deployment via `vercel.json`:
```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@now/node" }],
  "routes": [{ "src": "/(.*)", "dest": "index.js" }]
}
```

**Deployment steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DB_USER`
   - `DB_PASSWORD`
   - `JWT_SECRET`
4. Deploy automatically on push

## Project Structure

```
tasty-kitchen-server/
├── index.js            # Main server file with all routes
├── package.json        # Project dependencies
├── package-lock.json   # Dependency lock file
├── vercel.json         # Vercel deployment config
├── .env                # Environment variables (not in git)
├── .gitignore          # Git ignore file
├── .git/               # Git repository
└── README.md           # This file
```

## Security Recommendations

⚠️ **Important Security Considerations:**

- ✅ Never commit `.env` file to version control
- ✅ Use strong, unique `JWT_SECRET` values
- ✅ Keep MongoDB credentials secure
- ✅ Implement input validation and sanitization
- ✅ Add rate limiting for production
- ✅ Use HTTPS in production (Vercel handles this)
- ✅ Validate user email format before operations
- ✅ Consider adding password hashing for user accounts

## Error Handling

Common error responses:

- `401 Unauthorized` - Missing or invalid JWT token
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Future Enhancements

- [ ] User registration and login system
- [ ] Password authentication
- [ ] Admin panel for menu management
- [ ] Order management system
- [ ] Payment integration
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Comprehensive error handling
- [ ] Request validation middleware
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Caching layer for performance

## Troubleshooting

**Server won't start:**
- Check if port 5000 is in use: `lsof -i :5000`
- Verify Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

**MongoDB connection errors:**
- Verify `DB_USER` and `DB_PASSWORD` in `.env`
- Check MongoDB Atlas IP whitelist settings
- Confirm cluster URL is correct

**JWT authentication fails:**
- Ensure `JWT_SECRET` is set in `.env`
- Verify token format: `Authorization: Bearer {token}`
- Check if token has expired (10 hour limit)

**CORS errors:**
- Frontend must be making requests to the correct server URL
- Server has CORS enabled for all origins by default

## License

ISC

## Author & Support

For issues, questions, or contributions, please open an issue in the repository.