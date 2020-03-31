import { MongoQuery, ResourceBase } from '@andes/core';
import { Localidad } from './localidad.schema';
import * as mongoose from 'mongoose';

import { authenticate } from '../application';

class LocalidadResource extends ResourceBase {
    Model = Localidad;
    resourceName = 'localidad';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        provincia: {
            field: 'provincia._id',
            fn: value => mongoose.Types.ObjectId(value)
        }
        // search: ['nombre', 'provincia'];
    };
}

export const LocalidadCtr = new LocalidadResource();
export const LocalidadRouter = LocalidadCtr.makeRoutes();
