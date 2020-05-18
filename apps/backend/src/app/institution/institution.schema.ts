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
    codigo: {
        sisa: String
    },
    referente: {
        nombre: String,
        apellido: String,
        telefono: String
    },
    institutions: [
        {
            id: String,
            nombre: String
        }
    ],
    users: [
        {
            id: String,
            nombre: String,
            apellido: String,
            telefono: String
        }
    ],
    representante: {
        nombre: String,
        apellido: String,
        telefono: String
    },
});

if (environment.key) {
    InstitutionsSchema.plugin(AuditPlugin);
}

export const Institution = mongoose.model('institutions', InstitutionsSchema, 'institutions');
