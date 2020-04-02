import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';
import * as localidadSchema from './localidad.schema';

export const BarrioSchema = new mongoose.Schema({
    nombre: String,
    localidad: { type: localidadSchema }
});

if (environment.key) {
    BarrioSchema.plugin(AuditPlugin);
}

export const Barrio = mongoose.model('barrio', BarrioSchema, 'barrio');
