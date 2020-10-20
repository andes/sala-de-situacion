import * as mongoose from 'mongoose';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

const OcupationSchema = new mongoose.Schema({
    fechaIngreso: Date,
    horaIngreso: String,
    apellido: String,
    nombre: String,
    dni: String,
    habitacion: String,
    piso: String,
    servicio: String,
    cama: String,
    respirador: {
        type: String,
        enum: ['SI', 'NO']
    },
    covid: {
        type: String,
        enum: ['SI', 'NO']
    },
    oxigeno: {
        type: String,
        enum: ['SI', 'NO']
    },
    estado: String,
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    },
    exportado: Boolean,
    nroArchivo: Number
});
OcupationSchema.plugin(AuditPlugin);
OcupationSchema.index({
    createdAt: 1,
    'institution.id': 1

});
export const Ocupation = mongoose.model('ocupation', OcupationSchema, 'ocupations');
