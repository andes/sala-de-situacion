import * as mongoose from 'mongoose';

const DisclaimerSchema = new mongoose.Schema({
    version: String,
    texto: String,
    activo: Boolean
});
export const Disclaimer = mongoose.model('disclaimer', DisclaimerSchema, 'disclaimers');
