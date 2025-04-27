const {Router} = require('express');

const userRouter = require('./userRouter.js');
const authRouter = require('./authRouter.js')

const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/auth', authRouter)

module.exports = mainRouter;