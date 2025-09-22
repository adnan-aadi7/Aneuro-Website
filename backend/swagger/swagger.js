// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ANEURO',
      version: '1.0.0',
      description: 'API documentation for the ANEURO project',
    },
    servers: [
      {
        url: 'http://api.aneuro.io', 
       //url:"http://localhost:4000"
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
