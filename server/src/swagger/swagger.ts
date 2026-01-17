import swaggerJsdoc from 'swagger-jsdoc';
import { serverEnv } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Travel Mate API',
      version: '1.0.0',
      description: 'Dokumentacja API dla aplikacji Travel Mate - kompleksowej platformy do planowania podróży',
      contact: {
        name: 'Travel Mate Team',
        email: 'contact@travelmate.com',
      },
      license: {
        name: 'Private',
        url: 'https://travelmate.com/license',
      },
    },
    servers: [
      {
        url: `http://localhost:${serverEnv.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token z Firebase Authentication. Otrzymasz go po zalogowaniu przez POST /api/auth/login',
        },
      },
      schemas: {},
    },
    security: [],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpointy związane z rejestracją, logowaniem i zarządzaniem hasłem',
      },
      {
        name: 'Users',
        description: 'Zarządzanie profilem użytkownika',
      },
      {
        name: 'Trips',
        description: 'CRUD operacje na podróżach użytkownika',
      },
      {
        name: 'Flights',
        description: 'Wyszukiwanie lotów przez Amadeus API',
      },
      {
        name: 'Accommodations',
        description: 'Wyszukiwanie noclegów przez SerpAPI',
      },
      {
        name: 'Activities',
        description: 'Wyszukiwanie atrakcji turystycznych i restauracji',
      },
      {
        name: 'Plans',
        description: 'Generowanie i zarządzanie planami podróży przez AI',
      },
      {
        name: 'Expenses',
        description: 'Zarządzanie wydatkami podróży',
      },
      {
        name: 'Invitations',
        description: 'System zaproszeń do wspólnych podróży',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/swagger/schemas.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
