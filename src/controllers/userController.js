const User = require('../model/user.js');

const createUserController = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
        const error = new Error('El usuario ya existe');
        error.statusCode = 400; 
        throw error;
    }

    const newUser = await User.create(userData);
    return {
        id: newUser._id,
        documentType: newUser.documentType,
        documentNumber: newUser.documentNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
    };
};

const getUserProfileController = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if(!user || user.isDeleted) {
        throw new CustomError('Usuario no encontrado', 404);
    }

    return {
        id: user._id,
        documentType: newUser.documentType,
        documentNumber: newUser.documentNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
    };
};


module.exports = {
    createUserController,
    getUserProfileController,
};