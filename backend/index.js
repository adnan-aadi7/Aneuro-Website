import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { swaggerUi, specs } from './swagger/swagger.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import googlePassport from './services/googlePassport.js';
import facebookPassport from './services/facebookPassport.js';
import emailSequenceRoutes from './routes/emailSequencRoute.js';

const app = express();
const port = 3000;

// Initialize server function
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Mount webhook route BEFORE body parsers
    app.use('/api/webhook', webhookRoutes);

    // Now add CORS and JSON body parser for the rest of the app
    app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    app.use(express.json());

    // Session configuration for Passport
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Initialize Passport (both Google and Facebook)
    app.use(googlePassport.initialize());
    app.use(googlePassport.session());
    app.use(facebookPassport.initialize());
    app.use(facebookPassport.session());

    // Swagger docs route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.use("/api/", authRoutes);
    app.use("/api/ticket", ticketRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/email-sequences", emailSequenceRoutes);

    // Start server only after database connection is established
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
      console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
