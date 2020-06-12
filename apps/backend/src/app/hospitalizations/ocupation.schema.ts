import * as mongoose from 'mongoose';

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
        enum: ['Si', 'No']
    },
    covid: {
        type: String,
        enum: ['Si', 'No']
    },
    oxigeno: {
        type: String,
        enum: ['Si', 'No']
    },
    estado: {
        type: String,
        enum: ['disponible', 'bloqueda', 'ocupada']
    },
    user: {
        id: String,
        nombre: String,
        apellido: String,
        documento: String,
        email: String
    },
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    }
});
export const Ocupation = mongoose.model('ocupation', OcupationSchema, 'ocupations');
