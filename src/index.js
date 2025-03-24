require('dotenv').config();
const app = require('./app');
// const connectDB = require('./config/db'); // Importa la conexión a la base de datos
const logger = require('./config/logger'); // Importa el logger si lo usas

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
    try {
        // Conectar a la base de datos
        // await connectDB();
        await console.log('Connected to the database');

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