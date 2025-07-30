import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { swaggerUi, specs } from './swagger/swagger.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
const port = 3000;

// Connect to MongoDB once at server startup
connectDB();

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

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/", authRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
