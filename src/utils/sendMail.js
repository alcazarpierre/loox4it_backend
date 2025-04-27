const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Loox4it" <${process.env.GMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de activación enviado');
      } catch (error) {
        logger.error(`Error enviando correo: ${error.message}`);
        throw new Error('No se pudo enviar el correo de activación');
      }
};

module.exports = sendMail;