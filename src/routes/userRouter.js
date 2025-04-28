const {Router} = require('express');
const authMiddleware = require('../middleware/auth.js');

const {
    createUserHandler,
    getUserProfileHandler,
    updateUserHandler,
    deleteUserHandler,
    softDeleteUserHandler,
    getAllUsersHandler,
    getUserByIdHandler

} = require('../handlers/userHandler.js');

const userRouter = Router();

userRouter.post('/create', createUserHandler);
userRouter.get('/profile', getUserProfileHandler);
userRouter.put('/update', updateUserHandler);
userRouter.delete('/delete/:id', deleteUserHandler);
userRouter.patch('/soft-delete/:id', softDeleteUserHandler);
userRouter.get('/all', authMiddleware, getAllUsersHandler);
userRouter.get('/:id', authMiddleware, getUserByIdHandler);

module.exports = userRouter;