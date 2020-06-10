import * as mongoose from 'mongoose';

const CheckoutSchema = new mongoose.Schema({
    fechaEgreso: Date,
    horaEgreso: String,
    apellido: String,
    nombre: String,
    dni: String,
    fechaIngreso: Date,
    horaIngreso: String,
    tipo: String,
    user: {
        id: String,
        nombre: String,
        apellido: String,
        documento: String,
        email: String
    },
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    }
});
export const Checkout = mongoose.model('checkout', CheckoutSchema, 'checkouts');

