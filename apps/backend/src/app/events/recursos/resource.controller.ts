import { Resource } from './resource.schema';
import { MongoQuery, ResourceBase } from '@andes/core';
import { authenticate } from '../../application';

class ResourceResource extends ResourceBase {
    Model = Resource;
    resourceName = 'resources';
    middlewares = [authenticate()]
    searchFileds = {
        nombre: MongoQuery.partialString,
        activo: MongoQuery.partialString,
        key: MongoQuery.equalMatch,
        search: ['nombre', 'key']
    };
}

export const ResourceCtr = new ResourceResource();
export const ResourcesRoutes = ResourceCtr.makeRoutes();
