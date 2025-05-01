const logger = require ('../config/logger.js');
const sendToken = require('../utils/sendToken');
const CustomError = require ('../utils/CustomError.js');
const CustomSuccess = require ('../utils/CustomSuccess.js')

const {
    registerUserController, 
    activateUserController,
    loginUserController,
    logoutUserController,
    refreshTokenController,
    forgotPasswordController,
    resetPasswordController,
} = require('../controllers/authController');


const registerUserHandler = async(req, res, next) => {
    const { documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role } = req.body;
    try {
        const result = await registerUserController({ documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role });

        logger.info('✅ Usuario registrado correctamente (verificación pendiente)');
        next(new CustomSuccess(result.message, 201, process.env.NODE_ENV === 'development' ? { activationToken: result.activationToken } : {}));

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

        logger.info('✅ Usuario activado correctamente');
        sendToken(user, user.isNew? 201 : 200, res);

    } catch (error) {
        logger.error(`Error en activateUserHandler: ${error.message}`);
        next(error);
    }
}; 

const loginUserHandler = async (req, res, next) => {
    try {
        const user = await loginUserController(req.body);

        logger.info('✅ Usuario inició sesión correctamente');
        sendToken(user, 200, res);

    } catch (error) {
        logger.error(`Error en loginUserHandler: ${error.message}`);
        next(error);
    }
};

const logoutUserHandler = (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        const result = logoutUserController();
        logger.info('✅ Sesión cerrada correctamente');
        next(new CustomSuccess(result.message, 200));

    } catch (error) {
        logger.error(`🔴 Error en logoutUserHandler: ${error.message}`);
        next(error);
    }
};

const refreshTokenHandler = async (req, res, next) => {
    try {
        const token = refreshTokenController(req);

        logger.info('✅ Token refrescado correctamente');
        next(new CustomSuccess('Token refrescado correctamente', 200, { token }));

    } catch (error) {
        logger.error(`Error en refreshTokenHandler: ${error.message}`);
        next(error);
    }
};

const forgotPasswordHandler = async (req, res, next) => {
    try {
        const result = await forgotPasswordController(req.body.email);

        logger.info('✅ Correo de recuperación enviado');
        next(new CustomSuccess(result.message, 200, result.data));

    } catch (error) {
        logger.error(`🔴 Error en forgotPasswordHandler: ${error.message}`);
        next(error);
    }
};

const resetPasswordHandler = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await resetPasswordController(token, newPassword);

        logger.info('✅ Contraseña restablecida correctamente');
        sendToken(user, 200, res);

    } catch (error) {
        logger.error(`🔴 Error en resetPasswordHandler: ${error.message}`);
        next(error);
    }
};

module.exports = {
    registerUserHandler,
    activateUserHandler,
    loginUserHandler,
    logoutUserHandler,
    refreshTokenHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
};