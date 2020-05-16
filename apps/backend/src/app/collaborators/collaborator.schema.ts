
import * as mongoose from 'mongoose';

export const CollaboratorSchema = new mongoose.Schema({
    email: String,
    password: String,
    user: String,  // idColaboradorNación
    institucion: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    codigoNacion: Number // IdInstitucion Nación
});


export const Collaborator = mongoose.model('collaborators', CollaboratorSchema, 'collaborators');




