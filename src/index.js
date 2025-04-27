require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db'); 
const logger = require('./config/logger'); 
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function cleardatabaseIfDev() {
    if (NODE_ENV === 'development') {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            if (Object.hasOwnProperty.call(collections, key)) {
                try {
                    await collections[key].deleteMany({});
                    logger.warn(`🧹 Colección ${key} limpiada`);
                } catch (error) {
                    logger.error(`❌ Error al limpiar la colección ${key}: ${error.message}`);
                }
            }
        }
        logger.warn('⚠️ Base de datos borrada (modo desarrollo)');
    }
}

async function startServer() {
    try {
        // Conectar a la base de datos
        await connectDB();
        logger.info('✅ Connected to the database');

        await cleardatabaseIfDev();

        // Levantar el servidor
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
        }).on('error', (err) => {
            logger.error(`❌ Failed to start server: ${err.message}`);
        });

    } catch (error) {
        logger.error(`❌ Error initializing the server: ${error.message}`);
        process.exit(1); // Salir con código de error
    }
}

startServer();