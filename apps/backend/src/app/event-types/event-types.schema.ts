import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export interface EventTypes {
    key: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
    parametros: {
        key: string;
        label: string;
        type: string;
        descripcion: string;
        required: boolean;
        extras: any;
    }[];
}

export interface EventTypesDocument extends mongoose.Document, EventTypes {}

export const EventTypesSchema = new mongoose.Schema({
    key: String,
    nombre: String,
    descripcion: String,
    activo: { type: Boolean, default: true },
    institucion: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    parametros: [
        {
            key: String,
            label: String,
            type: String,
            descripcion: String,
            required: Boolean,
            extras: mongoose.SchemaTypes.Mixed
        }
    ]
});

if (environment.key) {
    EventTypesSchema.plugin(AuditPlugin);
}

export const EventTypes = mongoose.model<EventTypesDocument>('event-types', EventTypesSchema, 'event-types');
