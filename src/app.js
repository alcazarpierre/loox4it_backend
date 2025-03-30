require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger.js');
const fileUpload = require('express-fileupload');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurar CORS dinámicamente
const allowedOrigins = [
  process.env.FRONT_DOMAIN_1,
  process.env.FRONT_DOMAIN_2,
  'http://localhost:5173'
].filter(Boolean); // Filtra valores `undefined` para evitar errores

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`❌ CORS blocked request from: ${origin}`);
      callback(new Error('CORS Not Allowed'), false);
    }
  },
  credentials: true,
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

// Logging con Morgan (según entorno)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }) // Solo en desarrollo
  });
});

module.exports = app;
