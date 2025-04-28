const jwt = require ('jsonwebtoken');
const crypto = require ('crypto');
const User = require ('../model/user.js');
const sendMail = require ('../utils/sendMail.js');
const sendToken = require ('../utils/sendToken.js');
const generateActivationToken = require ('../utils/generateActivationToken.js');
const CustomError = require('../utils/CustomError.js');
const logger = require('../config/logger.js');

const registerUserController = async (userData) => {
    const { documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new CustomError('El usuario ya existe', 400);
    }

    const activationToken = generateActivationToken({ documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role });

    if (process.env.NODE_ENV === 'development') {
        logger.debug(`🔑 Token de activación generado: ${activationToken}`);
        console.log(`Token para activar la cuenta: ${activationToken}`);
    }

    const activationUrl = `${process.env.CLIENT_URL}/activate/${activationToken}`;

    await sendMail({
        email,
        subject: 'Verifica tu cuenta',
        message: `Hola ${firstName}, por favor verifica tu cuenta haciendo clic en el siguiente enlace: <a href=${activationUrl}>Verificar cuenta</a>`,
    });

    return {
        message: 'Usuario creado correctamente, por favor verifica tu cuenta en tu correo electrónico',
        ...(process.env.NODE_ENV === 'development' && { activationToken }) // <- 🔥
    };
};

const activateUserController = async (activationToken) => {
    try {
        const newUserData = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
        const { documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role } = newUserData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new CustomError('La cuenta ya fue activada previamente.', 400);
        }

        const user = await User.create({ documentType, documentNumber, firstName, lastName, email, phone, password, avatar, role });
        return user;

    } catch (err) {
        throw new CustomError('Token inválido o expirado', 400);
    }
};

const loginUserController = async ({email, password}) => {
    const user = await User.findOne({email}).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
        throw new CustomError('Credenciales Inválidas', 401);
    }
    return user;
};

const logoutUserController = () => {
    return {
        message: 'Sesión cerrada correctamente'
    }
};

const refreshTokenController = (req) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) throw new CustomError('No hay Token', 400);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({id: decoded.id}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return newToken;
};

const forgotPasswordController = async (email) => {
    const user = await User.findOne({email});
    if (!user) throw new CustomError('Usuario no encontrado', 400);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 15 *60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendMail({
        email: user.email,
        subject: 'Recuperación de contraseña',
        message: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetUrl}">${resetUrl}</a></p>`
    });

    return {
        message: 'Correo enviado correctamente'
    };

};

const resetPasswordController = async (token, newPassword) => {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if (!user) throw new CustomError('Token inválido o expirado', 400);

    user.password = newPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return user;
   
};

module.exports ={
    registerUserController,
    activateUserController,
    loginUserController,
    logoutUserController,
    refreshTokenController,
    forgotPasswordController,
    resetPasswordController,
}