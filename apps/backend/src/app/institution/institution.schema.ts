import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export const InstitutionsSchema = new mongoose.Schema({
    activo: Boolean,
    nombre: String,
    email: String,
    telefono: String,
    coordenadas: {
        type: [Number],
        index: '2d'
    },
    direccion: String,
    provincia: String,
    zona: String,
    localidad: String,
    tipoInstitutcion: String
});

if (environment.key) {
    InstitutionsSchema.plugin(AuditPlugin);
}

export const Institution = mongoose.model('institutions', InstitutionsSchema, 'institutions');
