import { MongoQuery, ResourceBase } from '@andes/core';

import { authenticate } from '../application';
import { Checkout } from './checkout.schema';

class CheckoutResource extends ResourceBase {
    Model = Checkout;
    resourceName = 'checkouts';
    middlewares = [authenticate()];
    searchFileds = {
        fechaEgreso: MongoQuery.equalMatch,
        fechaIngreso: MongoQuery.equalMatch,
        apellido: MongoQuery.partialString,
        nombre: MongoQuery.partialString,
        dni: MongoQuery.partialString,
        tipo: MongoQuery.equalMatch,
        nroArchivo: MongoQuery.equalMatch
    };
}

export const CheckoutCtr = new CheckoutResource();
export const CheckoutsRouter = CheckoutCtr.makeRoutes();
