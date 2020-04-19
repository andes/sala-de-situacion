import * as mongoose from 'mongoose';

export const ChartsSchema = new mongoose.Schema({
    chart_id: String,
    nombre: String,
    base_url: String,
    tenant: String,
    permisos: [String],
    activo: { type: Boolean, default: false },
    filter: String,
    operator: String,
    autorefresh: Number,
    theme: String,
    embedding_signing_key: String
});

export const Charts = mongoose.model('charts', ChartsSchema, 'charts');
