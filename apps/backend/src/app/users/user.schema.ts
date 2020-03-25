import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';
const bcrypt = require('bcrypt');

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
  permisos: [String],
  validationToken: String
});

// if (environment.key) {
//   UsersSchema.plugin(AuditPlugin);
// }

UsersSchema.pre('save', async function (next) {
  const user: any = this;
  const SALT_FACTOR = 5;

  if (user.isNew) {
    user.validationToken = new mongoose.Types.ObjectId().toHexString();
  }

  if (!user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    const hash = await bcrypt.hash(user.password, salt, null);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UsersSchema.methods.comparePassword = async function (passwordAttempt) {
  return await bcrypt.compare(passwordAttempt, this.password);
};

export const User = mongoose.model('users', UsersSchema, 'users');
