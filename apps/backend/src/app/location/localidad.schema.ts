import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';
import * as provinciaSchema from './provincia.schema';

export const LocalidadSchema = new mongoose.Schema({
    nombre: String,
    codLocalidad: String,
    departamento: String,
    provincia: { type: provinciaSchema }
});

if (environment.key) {
    LocalidadSchema.plugin(AuditPlugin);
}

export const Localidad = mongoose.model('localidad', LocalidadSchema, 'localidad');
