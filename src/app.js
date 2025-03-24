require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger.js');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

app.use((req, res, next) => {

    const allowedOrigins = [process.env.FRONT_DOMAIN_1, process.env.FRONT_DOMAIN_2, 'http://localhost:5173'];
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

  // Middleware de errores
  app.use((err, req, res, next) => { 
    logger.error(`Error: ${err.message}`);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).send(message);
    });

module.exports = app;
