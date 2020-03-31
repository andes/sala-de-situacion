import { MongoQuery, ResourceBase } from '@andes/core';
import { Barrio } from './barrio.schema';
import * as mongoose from 'mongoose';

import { authenticate } from '../application';

class BarrioResource extends ResourceBase {
    Model = Barrio;
    resourceName = 'barrio';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        localidad: {
            field: 'localidad._id',
            fn: value => mongoose.Types.ObjectId(value)
        }
        // search: ['nombre', 'localidad'];
    };
}

export const BarrioCtr = new BarrioResource();
export const BarrioRouter = BarrioCtr.makeRoutes();
