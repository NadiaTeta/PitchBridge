const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./models/User.model');
const path = require('path');

dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const investmentRoutes = require('./routes/investment.routes');
const chatRoutes = require('./routes/chat.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const { rateLimiter } = require('./middleware/rateLimiter.middleware');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

// --- MIDDLEWARE SECTION ---

// 1. CORS - Must be very early
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 2. Helmet - Relaxed for development to avoid blocking local resources/favicons
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));

// 3. Body Parsers - Essential for fixing the "entity.parse.failed" error
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Other Utilities
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 5. Rate Limiting (Applied only to API routes)
app.use('/api', rateLimiter);

// --- ROUTES SECTION ---

const API_VERSION = process.env.API_VERSION || 'v1';

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PitchBridge API is running',
    timestamp: new Date().toISOString()
  });
});

// API Endpoints
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/projects`, projectRoutes);
app.use(`/api/${API_VERSION}/investments`, investmentRoutes);
app.use(`/api/${API_VERSION}/chat`, chatRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded images statically

// --- ERROR HANDLING ---

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Final Error Middleware
app.use(errorHandler);

// --- SOCKET LOGIC ---
io.on('connection', (socket) => {
  socket.on('join-chat', (chatId) => socket.join(chatId));
  socket.on('send-message', (data) => {
    io.to(data.chatId).emit('new-message', data.message);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// --- DATABASE & STARTUP ---
const connectDB = async () => {
  try {
    // Removed deprecated options for a cleaner console
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('No admin found. Creating initial admin...');
      await User.create({
        name: "System Admin",
        email: "admin@pitchbridge.rw", // Use an email you can log in with
        password: "AdminPassword123",  // This will be hashed automatically by your model
        role: "admin",
        emailVerified: true,
        documentsUploaded: true,
        status: 'approved'
      });
      console.log("✅ Default Admin created: admin@pitchbridge.rw");
    }
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };