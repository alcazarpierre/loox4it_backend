const { 
    createUserController, 
    getUserProfileController, 
    updateUserController, 
    softDeleteUserController, 
    deleteUserController, 
    getAllUsersController, 
    getUserByIdController 
} = require('../controllers/userController.js');
const CustomSuccess = require('../utils/CustomSuccess.js');
const logger = require('../config/logger.js');

const createUserHandler = async (req, res, next) => {
    const userData = req.body;

    try {
        const successResponse = await createUserController(userData);
        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en createUserHandler: ${error.message}`);
        next(error);
    }
};

const getUserProfileHandler = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const successResponse = await getUserProfileController(userId);

        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en getUserProfileHandler: ${error.message}`);
        next(error);
    }
};

const updateUserHandler = async (req, res, next) => {
    const userId = req.user.id;
    const userData = req.body;

    try {
        const successResponse = await updateUserController(userId, userData);
        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en updateUserHandler: ${error.message}`);
        next(error);
    }
};

const softDeleteUserHandler = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const successResponse = await softDeleteUserController(userId);
        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en softDeleteUserHandler: ${error.message}`);
        next(error);
    }
};

const deleteUserHandler = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const successResponse = await deleteUserController(userId);
        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en deleteUserHandler: ${error.message}`);
        next(error);
    }
};

const getAllUsersHandler = async (req, res, next) => {
    try {
        const successResponse = await getAllUsersController();
        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en getAllUsersHandler: ${error.message}`);
        next(error);
    }
};

const getUserByIdHandler = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const successResponse = await getUserByIdController(userId);
        res.status(successResponse.statusCode).json({
            success: true,
            message: successResponse.message,
            data: successResponse.data,
        });
    } catch (error) {
        logger.error(`Error en getUserByIdHandler: ${error.message}`);
        next(error);
    }
};

module.exports = {
    createUserHandler,
    getUserProfileHandler,
    updateUserHandler,
    softDeleteUserHandler,
    deleteUserHandler,
    getAllUsersHandler,
    getUserByIdHandler,
};
