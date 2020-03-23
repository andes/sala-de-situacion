import * as mongoose from 'mongoose';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export const UsersSchema = new mongoose.Schema({
  activo: Boolean,
  nombre: String,
  apellido: String,
  documento: String,
  email: String,
  telefono: String,
  password: String,
  permisos: [String]
});
UsersSchema.plugin(AuditPlugin);

export const User = mongoose.model('users', UsersSchema, 'users');
