import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export const InstitutionsSchema = new mongoose.Schema({
    activo: { type: Boolean, default: false },
    nombre: String,
    email: String,
    telefono: String,
    coordenadas: {
        type: [Number],
        index: '2d'
    },
    direccion: String,
    barrio: String,
    localidad: String,
    provincia: String,
    zona: String,
    tipoInstitutcion: String,
    users: [
        {
            id: String,
            nombre: String,
            apellido: String,
            documento: String
        }
    ],
    admins: [
        {
            id: String,
            nombre: String,
            apellido: String,
            documento: String
        }
    ]
});

if (environment.key) {
    InstitutionsSchema.plugin(AuditPlugin);
}

export const Institution = mongoose.model('institutions', InstitutionsSchema, 'institutions');
