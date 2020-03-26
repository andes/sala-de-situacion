import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

export const indicatorsSchema = new mongoose.Schema({
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
  activo: { type: Boolean, default: false },
  nombre: String,
  categoria: {
    type: String,
    index: { unique: true }
  },
  indicadores: [indicatorsSchema]
});

if (environment.key) {
  EventsSchema.plugin(AuditPlugin);
}

export const Event = mongoose.model('events', EventsSchema, 'events');
