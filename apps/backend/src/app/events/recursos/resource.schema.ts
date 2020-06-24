import * as mongoose from 'mongoose';

export const ResourcesSchema = new mongoose.Schema({
    activo: { type: Boolean, default: false },
    nombre: String,
    key: String
});

export const Resource = mongoose.model('resources', ResourcesSchema, 'resources');
