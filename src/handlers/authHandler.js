const logger = require ('../config/logger.js');
const CustomError = require ('../utils/CustomError.js');

const {
    registerUserController, 
    activateUserController,
    loginUserController,
    logoutUserController,
    refreshTokenController,
    forgotPasswordController,
    resetPasswordController,
} = require('../controllers/authController');

const sendToken = require('../utils/sendToken');

const registerUserHandler = async(req, res, next) => {
    const { documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role } = req.body;
    try {
        const result = await registerUserController({ documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role });
        res.status(201).json(result);
    } catch (error) {
        logger.error(`Error en registerUserHandler: ${error.message}`);
        next(error);
    }
};

const activateUserHandler = async (req, res, next) => {
    try {
        const {activationToken} = req.body;
        if (!activationToken) {
            throw new CustomError('Token de activación requerido', 400);
        }

        const user = await activateUserController(activationToken);

        sendToken(user, 201, res);
    } catch (error) {
        logger.error(`Error en activateUserHandler: ${error.message}`);
        next(error);
    }
}; 

const loginUserHandler = async (req, res, next) => {
    try {
        const user = await loginUserController(req.body);
        sendToken(user, 200, res);
    } catch (error) {
        logger.error(`Error en loginUserHandler: ${error.message}`);
        next(error);
    }
};

const logoutUserHandler = (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    const result = logoutUserController();
    res.status(200).json({success: true, ...result});
};

const refreshTokenHandler = async (req, res, next) => {
    try {
        const token = refreshTokenController(req);
        res.status(200).json({success: true, token});
    } catch (error) {
        logger.error(`Error en refreshTokenHandler: ${error.message}`);
        next(error);
    }
};

const forgotPasswordHandler = async (req, res, next) => {
    try {
        const result = await forgotPasswordController(req.body.email);
        res.status(200).json({success: true, ...result});
    } catch (error) {
        logger.error(`Error en forgotPasswordHandler: ${error.message}`);
        next(error);
    }
};

const resetPasswordHandler = async (req, res, next) => {
    try {
        const {token} = req.params;
        const {password} = req.body;
        const user = await resetPasswordController(token, password);
        sendToken(user, 200, res);
    } catch (error) {
        logger.error(`Error en resetPasswordHandler: ${error.message}`);
        next(error);
    };
}

module.exports = {
    registerUserHandler,
    activateUserHandler,
    loginUserHandler,
    logoutUserHandler,
    refreshTokenHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
};