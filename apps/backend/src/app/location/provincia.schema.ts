import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export const ProvinciaSchema = new mongoose.Schema({
    nombre: String
});

if (environment.key) {
    ProvinciaSchema.plugin(AuditPlugin);
}

export const Provincia = mongoose.model('provincia', ProvinciaSchema, 'provincia');
