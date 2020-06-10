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
    tipo: String,
    repirador: String,
    covid: String,
    estado: String,
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
