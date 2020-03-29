import { MongoQuery, ResourceBase } from '@andes/core';
import { Provincia } from './provincia.schema';
import { authenticate } from '../application';

class ProvinciaResource extends ResourceBase {
    Model = Provincia;
    resourceName = 'provincia';
    // middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        search: ['nombre']
    };
}

export const ProvinciaCtr = new ProvinciaResource();
export const ProvinciaRouter = ProvinciaCtr.makeRoutes();
