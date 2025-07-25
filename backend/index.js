import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { swaggerUi, specs } from './swagger/swagger.js';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'


const app = express();
const port = 3000;

connectDB();
app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/", authRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
