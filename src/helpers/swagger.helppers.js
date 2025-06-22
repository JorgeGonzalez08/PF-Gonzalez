import swaggerJsDoc from 'swagger-jsdoc';

const opts = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Eccomerce',
      description: 'Documentacion de la API del proyecto final de coderhouse',
    },
  },
  apis: ['./src/docs/*.yaml'],
};

const swaggerSpecs = swaggerJsDoc(opts);
export default swaggerSpecs;
