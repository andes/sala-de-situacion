import * as mongoose from 'mongoose';

export const ChartsSchema = new mongoose.Schema({
    chart_id: String,
    nombre: String,
    base_url: String,
    tenant: String,
    permisos: [String],
    activo: { type: Boolean, default: false }
});

export const Charts = mongoose.model('charts', ChartsSchema, 'charts');
