const {Router} = require('express');

const {
    createUserHandler,
    getUserProfileHandler,
} = require('../handlers/userHandler.js');

const userRouter = Router();

userRouter.post('/create', createUserHandler);
userRouter.get('/profile', getUserProfileHandler);

module.exports = userRouter;