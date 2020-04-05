import * as mongoose from 'mongoose';
const bcrypt = require('bcrypt');

// eslint-disable-next-line no-useless-escape
const EMAILRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const UsersSchema = new mongoose.Schema({
    active: { type: Boolean, default: false },
    nombre: String,
    apellido: String,
    documento: String,
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: EMAILRegexp,
        index: { unique: true }
    },
    telefono: String,
    password: String,
    permisos: [
        {
            institucion: { _id: mongoose.Types.ObjectId, nombre: String },
            accesos: [String]
        }
    ],
    validationToken: String
});

// if (environment.key) {
//   UsersSchema.plugin(AuditPlugin);
// }
UsersSchema.pre('save', async function (this: any, next) {
    const SALT_FACTOR = 5;

    if (this.isNew) {
        this.validationToken = new mongoose.Types.ObjectId().toHexString();
    }

    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        const hash = await bcrypt.hash(this.password, salt, null);
        this.password = hash;
        return next();
    } catch (err) {
        return next(err);
    }
});

UsersSchema.methods.comparePassword = async function (passwordAttempt) {
    return await bcrypt.compare(passwordAttempt, this.password);
};

export const User = mongoose.model('users', UsersSchema, 'users');
