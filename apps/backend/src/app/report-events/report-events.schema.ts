
import * as mongoose from 'mongoose';

export const ReportEventsSchema = new mongoose.Schema({
    fecha: Date,
    type: String,
    institucion: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    servicio: {
        _id: false,
        id: mongoose.SchemaTypes.ObjectId,
        nombre: String
    },
    report: mongoose.SchemaTypes.Mixed

});


export const ReportEvent = mongoose.model('report-events', ReportEventsSchema, 'report-events');

