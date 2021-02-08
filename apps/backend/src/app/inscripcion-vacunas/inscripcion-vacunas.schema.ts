
import * as mongoose from 'mongoose';

export const InscripcionVacunaSchema = new mongoose.Schema({
    documento: String,
    nombre: String,
    apellido: String,
    cuil: String,
    fechaDeNacimiento: Date,
    sexo: String,
    email: String,
    telefono: String,
    localidad: String,
    estado: String
});


export const InscripcionVacuna = mongoose.model('inscripcion-vacuna', InscripcionVacunaSchema, 'inscripcion-vacunas');


