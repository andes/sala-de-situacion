import { MongoQuery, ResourceBase } from '@andes/core';

import { authenticate } from '../application';
import { Ocupation } from './ocupation.schema';

class OcupationResource extends ResourceBase {
    Model = Ocupation;
    resourceName = 'ocupations';
    middlewares = [authenticate()];
    searchFileds = {
        fechaIngreso: MongoQuery.equalMatch,
        apellido: MongoQuery.partialString,
        nombre: MongoQuery.partialString,
        dni: MongoQuery.partialString,
        respirador: MongoQuery.equalMatch,
        covid: MongoQuery.equalMatch,
        tipo: MongoQuery.equalMatch,
        nroArchivo: MongoQuery.equalMatch
    };
}

export const OcupationCtr = new OcupationResource();
export const OcupationsRouter = OcupationCtr.makeRoutes();
