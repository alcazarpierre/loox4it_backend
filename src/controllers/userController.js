const User = require('../model/user.js');
const CustomError = require('../utils/CustomError.js');
const CustomSuccess = require('../utils/CustomSuccess.js');
const logger = require('../config/logger.js');

const createUserController = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        logger.warn(`Intento de creación de usuario fallido: El usuario con el correo ${userData.email} ya existe.`);
        throw new CustomError('El usuario ya existe', 400);
    }

    const newUser = await User.create(userData);
    logger.info(`Usuario creado exitosamente: ${newUser._id}`);
    return new CustomSuccess('Usuario creado correctamente', 201, newUser);
};

const getUserProfileController = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user || user.isDeleted) {
        logger.warn(`Usuario no encontrado o desactivado: ${userId}`);
        throw new CustomError('Usuario no encontrado', 404);
    }
    logger.info(`Perfil del usuario obtenido: ${userId}`);
    return new CustomSuccess('Perfil obtenido correctamente', 200, user);
};

const updateUserController = async (userId, userData) => {
    const user = await User.findById(userId);
    if (!user) {
        logger.warn(`Intento de actualización fallido: Usuario no encontrado con ID ${userId}`);
        throw new CustomError('Usuario no encontrado', 404);
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'email', 'avatar'];

    allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
            user[field] = userData[field];
        }
    });

    await user.save();
    logger.info(`Usuario actualizado: ${userId}`);
    return new CustomSuccess('Usuario actualizado correctamente', 200, user);
};

const softDeleteUserController = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        logger.warn(`Intento de eliminación fallido: Usuario no encontrado con ID ${userId}`);
        throw new CustomError('Usuario no encontrado', 404);
    }

    user.isActive = false;
    user.isDeleted = true;

    await user.save();
    logger.info(`Usuario desactivado correctamente: ${userId}`);
    return new CustomSuccess('Usuario desactivado correctamente', 200, user);
};

const deleteUserController = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        logger.warn(`Intento de eliminación permanente fallido: Usuario no encontrado con ID ${userId}`);
        throw new CustomError('Usuario no encontrado', 404);
    }

    await user.deleteOne();
    logger.info(`Usuario eliminado permanentemente: ${userId}`);
    return new CustomSuccess('Usuario eliminado permanentemente', 200, { message: 'Usuario eliminado permanentemente' });
};

const getAllUsersController = async () => {
    const users = await User.find({ isActive: true, isDeleted: false });
    logger.info(`Obtención de todos los usuarios activos: ${users.length} usuarios encontrados`);
    return new CustomSuccess('Usuarios obtenidos correctamente', 200, users);
};

const getUserByIdController = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        logger.warn(`Usuario no encontrado con ID ${userId}`);
        throw new CustomError('Usuario no encontrado', 404);
    }
    logger.info(`Usuario encontrado: ${userId}`);
    return new CustomSuccess('Usuario encontrado correctamente', 200, user);
};

module.exports = {
    createUserController,
    getUserProfileController,
    updateUserController,
    softDeleteUserController,
    deleteUserController,
    getAllUsersController,
    getUserByIdController,
};
