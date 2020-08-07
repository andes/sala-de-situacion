import * as mongoose from 'mongoose';

export const ServicioSchema = new mongoose.Schema({
    nombre: String,
    equivalencias: [{
        type: String,
        lowercase: true
    }]
});

export const Servicio = mongoose.model('servicios', ServicioSchema, 'servicios');
