const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        process.exit(1); // Salir con código de error
    }
};

module.exports = connectDB;
