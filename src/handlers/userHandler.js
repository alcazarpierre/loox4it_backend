const logger = require('../config/logger.js');

const {
    createUserController,
    getUserProfileController,
} = require('../controllers/userController.js');

const createUserHandler = async (req, res, next) => {
    
    const userData = req.body;

    try {
        const newUser = await createUserController(userData);

        res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente',
            user: newUser,
        });
        
    } catch (error) {
        logger.error(`Error en createUserHandler: ${error.message}`);
        next (error);
        
    }
};

const getUserProfileHandler = async (req,res,next) => {
    try {
        const userId = req.user.id;
        const userProfile = await getUserProfileController(userId);

        res.status(200).json({
            success: true,
            user: userProfile,
        });
    } catch (error) {
        logger.error(`Error en getUserProfileHandler: ${error.message}`);
        next(error);
    }
};

module.exports = {
    createUserHandler,
    getUserProfileHandler,
};