const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
require('express-async-errors');

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'relay_ai_enterprise_super_secret_jwt_key_2026';
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler } = require('./middleware/errorHandler');
const { scheduler } = require('./automation/scheduler');

// Route Handlers
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const requestRoutes = require('./routes/requests');
const taskRoutes = require('./routes/tasks');
const approvalRoutes = require('./routes/approvals');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');
const workflowRoutes = require('./routes/workflows');
const automationRoutes = require('./routes/automation');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'RELAY AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiProvider: process.env.GEMINI_API_KEY ? 'Google Gemini (Active)' : 'Heuristic Simulation / Demo Mode',
    database: process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Local Demo Dataset'
  });
});

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server and Automation Scheduler
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 RELAY AI Enterprise Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🧠 AI Engine: Google Gemini API (${process.env.GEMINI_MODEL || 'gemini-1.5-flash'})`);
  console.log(`=================================================`);
  
  // Start background deadline & escalation monitoring
  scheduler.start();
});

module.exports = { app, server };
