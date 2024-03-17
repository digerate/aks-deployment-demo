const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Enhanced Node.js App API',
        version: '1.0.0',
        description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
    // This path is relative to the location of the swagger.js file
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;

console.log(swaggerSpec);