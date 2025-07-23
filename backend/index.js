// index.js
import express from 'express';
import connectDB from './db/db.js';
import { swaggerUi, specs } from './swagger/swagger.js';


const app = express();
const port = 3000;

connectDB();
app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
