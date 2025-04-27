const jwt = require('jsonwebtoken');

const generateActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "10m"
    });
};

module.exports = generateActivationToken;