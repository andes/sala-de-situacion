import * as mongoose from 'mongoose';

export const ServicioSchema = new mongoose.Schema({
    nombre: String
});

export const Servicio = mongoose.model('servicios', ServicioSchema, 'servicios');
