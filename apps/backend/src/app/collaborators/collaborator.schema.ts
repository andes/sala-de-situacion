
import * as mongoose from 'mongoose';

export const CollaboratorSchema = new mongoose.Schema({
    email: String,
    password: String,
    user: String,
    institution: String
});


export const Collaborator = mongoose.model('collaborators', CollaboratorSchema, 'collaborators');




