import * as mongoose from 'mongoose';
import { AuditPlugin } from '@andes/mongoose-plugin-audit';

const CheckoutSchema = new mongoose.Schema({
    fechaEgreso: Date,
    horaEgreso: String,
    apellido: String,
    nombre: String,
    dni: String,
    fechaIngreso: Date,
    horaIngreso: String,
    tipo: String,
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    },
    exportado: Boolean,
    nroArchivo: Number
});
CheckoutSchema.plugin(AuditPlugin);
CheckoutSchema.index({
    createdAt: 1,
    'institution.id': 1

});
export const Checkout = mongoose.model('checkout', CheckoutSchema, 'checkouts');

