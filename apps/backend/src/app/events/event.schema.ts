import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export interface EventTypes {
    categoria: string;
    nombre: string;
    activo: boolean;
    indicadores: {
        key: string;
        label: string;
        type: string;
        descripcion: string;
        required: boolean;
        extras: any;
    }[];
}

export interface EventTypesDocument extends mongoose.Document, EventTypes {}

export const IndicatorsSchema = new mongoose.Schema({
    key: {
        type: String,
        trim: true,
        lowercase: true,
        index: { unique: true }
    },
    label: String,
    descripcion: String,
    type: String,
    min: Number,
    max: Number,
    required: Boolean
});

export const EventsSchema = new mongoose.Schema({
    activo: { type: Boolean, default: true },
    nombre: String,
    categoria: {
        type: String,
        index: { unique: true }
    },
    indicadores: [IndicatorsSchema]
});

if (environment.key) {
    EventsSchema.plugin(AuditPlugin);
}

export const Event = mongoose.model<EventTypesDocument>('events', EventsSchema, 'events');
