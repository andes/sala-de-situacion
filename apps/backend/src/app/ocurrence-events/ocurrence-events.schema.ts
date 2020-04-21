import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';
import { OcurrenceEventHistory } from './../ocurrence-events-history/ocurrence-events-history.schema';


export interface OcurrenceEvent {
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
}


export interface OcurrenceEventDocument extends mongoose.Document, OcurrenceEvent { }

export const OcurrenceEventSchema = new mongoose.Schema({
    eventKey: String,
    activo: { type: Boolean, default: true },
    institucion: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    fecha: Date,
    indicadores: mongoose.SchemaTypes.Mixed
});

if (environment.key) {
    OcurrenceEventSchema.plugin(AuditPlugin);
}

export const OcurrenceEvent = mongoose.model<OcurrenceEventDocument>(
    'ocurrence_event',
    OcurrenceEventSchema,
    'ocurrence_event'
);



