

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    // Opciones para la cookie
    const options = {
        httpOnly: true, // evita que el token sea accedido por JS del frontend
        secure: process.env.NODE_ENV === 'production', // solo en HTTPS en producción
        sameSite: 'Strict', // evita CSRF en la mayoría de los casos
        maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
    };

    // Elimina el password del objeto antes de enviarlo
    const { password, ...userData } = user.toObject();

    // Enviar la cookie + respuesta JSON
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            message: 'Autenticación exitosa',
            token,
            user: userData,
        });
};

module.exports = sendToken;