const jwt = require('jsonwebtoken');
const User = require ('../model/user.js');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.isDeleted) {
            return res.status(401).json({ success: false, message: 'Usuario no válido o eliminado' });
        }

        req.user = {id: user._id, role: user.role};
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' })
    }   
    
};

module.exports = authMiddleware;