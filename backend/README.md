# PitchBridge Backend API

## Overview
Backend API for PitchBridge - A platform connecting Rwandan entrepreneurs with global investors.

## Features
- ✅ User authentication (JWT-based)
- ✅ Email verification
- ✅ Document upload and verification
- ✅ Project management (CRUD operations)
- ✅ Investment tracking
- ✅ Real-time chat (Socket.IO)
- ✅ Admin dashboard
- ✅ File uploads (images, videos, documents)
- ✅ Rate limiting
- ✅ Role-based access control

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** Socket.IO
- **File Upload:** Multer
- **Email:** Nodemailer
- **Security:** Helmet, CORS, bcryptjs

## Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- SMTP server for emails (Gmail, SendGrid, etc.)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd pitchbridge-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pitchbridge
JWT_SECRET=your-super-secret-key
CLIENT_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Start MongoDB
If using local MongoDB:
```bash
mongod
```

### 5. Run the application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "entrepreneur" // or "investor"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456"
}
```

### User Endpoints

All user endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get Profile
```http
GET /users/profile/:id?
```

#### Update Profile
```http
PUT /users/profile
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "New bio",
  "location": "Kigali"
}
```

#### Add to Watchlist
```http
POST /users/watchlist/:projectId
```

#### Get Watchlist
```http
GET /users/watchlist
```

### Project Endpoints

#### Get All Projects
```http
GET /projects?category=Agriculture&page=1&limit=12
```

#### Get Single Project
```http
GET /projects/:id
```

#### Create Project (Entrepreneur only)
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Smart Poultry Farm",
  "description": "Modern poultry farming...",
  "category": "Agriculture",
  "location": "Musanze",
  "fundingGoal": 15000000,
  "roi": "Expected 30% annual return..."
}
```

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

### Investment Endpoints

#### Create Investment (Investor only)
```http
POST /investments
Authorization: Bearer <token>
Content-Type: application/json

{
  "project": "projectId",
  "amount": 5000000
}
```

#### Get My Investments
```http
GET /investments/my-investments
Authorization: Bearer <token>
```

### Chat Endpoints

#### Get All Chats
```http
GET /chat
Authorization: Bearer <token>
```

#### Create Chat
```http
POST /chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "projectId"
}
```

#### Send Message
```http
POST /chat/:chatId/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Hello, I'm interested in your project"
}
```

### Admin Endpoints (Admin only)

#### Get Pending Verifications
```http
GET /admin/verifications/pending
Authorization: Bearer <admin-token>
```

#### Approve Project
```http
PUT /admin/verifications/:projectId/approve
Authorization: Bearer <admin-token>
```

#### Reject Project
```http
PUT /admin/verifications/:projectId/reject
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Incomplete documentation"
}
```

### Upload Endpoints

#### Upload Document
```http
POST /upload/document
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
type: "nid" // or "tin", "rdb", "selfie"
```

#### Upload Image
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

## WebSocket Events (Real-time Chat)

### Client Events
- `join-chat` - Join a chat room
- `send-message` - Send a message
- `typing` - Typing indicator

### Server Events
- `new-message` - Receive new message
- `user-typing` - User is typing

## Database Models

### User Model
- name, email, password (hashed)
- role: entrepreneur | investor | admin
- emailVerified, documentsUploaded, accountApproved
- verificationLevel: bronze | silver | gold
- documents, projects, watchlist, portfolio

### Project Model
- name, description, category, location
- fundingGoal, raised, roi
- entrepreneur (ref: User)
- status, approvalStatus
- verified (nid, rdb)

### Investment Model
- investor (ref: User)
- project (ref: Project)
- amount, status
- termsAgreed, paymentStatus

### Chat Model
- project (ref: Project)
- investor, entrepreneur (ref: User)
- messages array
- lastMessage, unreadCount

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Role-based access control

## Error Handling
All errors return JSON in the format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing
```bash
npm test
```

## Project Structure
```
pitchbridge-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── uploads/             # File uploads
├── .env.example         # Environment template
├── package.json
└── README.md
```

## Deployment

### Using PM2 (Production)
```bash
npm install -g pm2
pm2 start src/server.js --name pitchbridge-api
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT

## Support
For issues or questions, please contact: support@pitchbridge.rw