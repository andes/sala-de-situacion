
import * as mongoose from 'mongoose';

export const CollaboratorSchema = new mongoose.Schema({
    email: String,
    password: String,
    user: String,  // idColaboradorNación
    institution: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    codigoNacion: Number, // IdInstitucion Nación
    activo: Boolean
});


export const Collaborator = mongoose.model('collaborators', CollaboratorSchema, 'collaborators');




