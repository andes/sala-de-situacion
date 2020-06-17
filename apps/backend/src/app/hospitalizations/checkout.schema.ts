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
    tipo: {
        type: String,
        enum: ['DEFUNCION', 'ALTA', 'DERIVACION', 'RETIRO VOLUNTARIO']
    },
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    }
});
CheckoutSchema.plugin(AuditPlugin);
export const Checkout = mongoose.model('checkout', CheckoutSchema, 'checkouts');

