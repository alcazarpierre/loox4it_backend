const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({

    documentType: {
        type: String,
        required: true,
        enum: ['DNI', 'CE'],
      },
      documentNumber: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        unique: true,
      },
    firstName: {
        type: String,
        required: [true, 'Por favor ingrese su nombre'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: [true, 'Por favor ingrese sus apellidos'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },  
    phone :{
        type: String,
        required: [true, 'Por favor ingrese su número móvil'],
        match: [/^[0-9]{9,11}$/, "Formato de teléfono inválido"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Por favor ingrese su correo electrónico'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Formato de correo inválido"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Por favor ingrese su contraseña'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false
    },
    avatar:{
        public_id: {
            type: String,
        },
        url: {
            type: String,
            default: null,      
        },
    },
    isActive: {
        type: Boolean,
        default: false,
      },
    role: {
        type: String,
        enum: ['admin', 'seller', 'user'],
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
    versionKey: false,
});

userSchema.pre('save', async function(next) {
    // Generar userId si cambia el tipo o número de documento
    if (this.isModified('documentType') || this.isModified('documentNumber')) {
        this.userId = `${this.documentType}${this.documentNumber}`;
    }

    // Encriptar contraseña solo si ha sido modificada
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(new Error('Error al encriptar la contraseña'));
    }
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password); // Comparar la contraseña ingresada con la almacenada
};

userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};



module.exports = mongoose.models.User || mongoose.model('User', userSchema);