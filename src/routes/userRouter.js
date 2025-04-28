const {Router} = require('express');

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
userRouter.get('/all', getAllUsersHandler);
userRouter.get('/:id', getUserByIdHandler);

module.exports = userRouter;