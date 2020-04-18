import { MongoQuery, ResourceBase } from '@andes/core';

import { authenticate } from '../application';
import { Servicio } from './servicios.schema';

class ServiciosResource extends ResourceBase {
    Model = Servicio;
    resourceName = 'servicios';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        search: ['nombre']
    };
}

export const ServiciosCtr = new ServiciosResource();
export const ServiciosRouter = ServiciosCtr.makeRoutes();
