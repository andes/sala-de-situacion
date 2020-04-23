import * as mongoose from 'mongoose';

export interface OcurrenceEventHistory {
    eventKey: string;
    activo: boolean;
    fecha: Date;
    institucion: {
        id: mongoose.Types.ObjectId;
        nombre: string;
    };
    indicadores: {
        key: string;
        valor: any;
    }[];
    originalRef: mongoose.Types.ObjectId;
    createdAt: Date;
    createdBy: mongoose.Types.Subdocument;
}

export interface OcurrenceEventHistoryDocument extends mongoose.Document, OcurrenceEventHistory { }

export const OcurrenceEventHistorySchema = new mongoose.Schema({
    eventKey: String,
    activo: { type: Boolean, default: true },
    institucion: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    fecha: Date,
    indicadores: mongoose.SchemaTypes.Mixed,
    originalRef: mongoose.SchemaTypes.ObjectId,
    createdAt: { type: Date, required: false },
    createdBy: { type: mongoose.SchemaTypes.Mixed, required: false }
});


export const OcurrenceEventHistory = mongoose.model<OcurrenceEventHistoryDocument>(
    'ocurrence_event_history',
    OcurrenceEventHistorySchema,
    'ocurrence_event_history'
);
