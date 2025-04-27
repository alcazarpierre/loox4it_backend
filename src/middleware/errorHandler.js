const logger = require('../config/logger.js');
const CustomSuccess = require('../utils/CustomSuccess.js');

const errorHandler = (err, req, res, next) => {

    if (err instanceof CustomSuccess) {
        return res.status(err.statusCode).json({
            success: true,
            message: err.message,
            data: err.data,
        });
    }
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    logger.error(`🔴 Error: ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    }); 
};

module.exports = errorHandler;
