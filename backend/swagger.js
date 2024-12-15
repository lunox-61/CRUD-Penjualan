// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Penjualan',
      version: '1.0.0',
      description: 'API untuk mengelola penjualan produk',
    },
  },
  apis: ['./server.js'], // Menunjukkan lokasi file dengan anotasi Swagger
};

// Membuat dokumentasi Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
