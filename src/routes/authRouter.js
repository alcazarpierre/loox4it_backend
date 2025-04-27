const {Router} = require ('express');

const {
    registerUserHandler, 
    activateUserHandler,
    loginUserHandler,
    logoutUserHandler,
    refreshTokenHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
} = require('../handlers/authHandler');

const authRouter = Router();

authRouter.post('/register', registerUserHandler);
authRouter.post('/activate', activateUserHandler);
authRouter.post('/login', loginUserHandler);
authRouter.get('/logout', logoutUserHandler);
authRouter.get('/refresh-token', refreshTokenHandler);
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password/:token', resetPasswordHandler);

module.exports = authRouter;