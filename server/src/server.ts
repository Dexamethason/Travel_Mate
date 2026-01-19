import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { serverEnv } from './config/env';
import { initializeFirebase } from './config/firebase';
import { errorHandler, notFound } from './middleware/errorHandler';
import indexRoutes from './routes/index';
import { swaggerSpec } from './swagger/swagger';

const app = express();
const PORT = serverEnv.port;

// Inicjalizacja Firebase
initializeFirebase();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Konfiguracja CORS
const corsOptions = {
  origin: serverEnv.allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Trasa health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: serverEnv.nodeEnv,
  });
});

// Główna trasa - przekierowanie do health check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Travel Mate API Server',
    status: 'OK',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api-docs'
    }
  });
});

// Swagger UI - dokumentacja API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Travel Mate API Documentation',
}));

// Główne trasy API
app.use('/api', indexRoutes);

// Import tras (dodaj gdy będą utworzone)
// import userRoutes from './routes/userRoutes';
// import tripRoutes from './routes/tripRoutes';
// app.use('/api/users', userRoutes);
// app.use('/api/trips', tripRoutes);

// Middleware obsługi błędów (musi być na końcu)
app.use(notFound);
app.use(errorHandler);

// Uruchomienie serwera
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${serverEnv.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;
