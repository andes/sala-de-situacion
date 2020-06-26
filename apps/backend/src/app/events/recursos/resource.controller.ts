import { Resource } from './resource.schema';
import { MongoQuery, ResourceBase } from '@andes/core';
import { authenticate } from '../../application';
import * as mongoose from 'mongoose';
import { environment } from '../../../environments/environment';

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

ResourcesRoutes.get('/resources/elements/:recurso', async (req, res, next) => {
    const recurso = req.params.recurso;
    let query = {};
    if (req.query.search) {
        query = { nombre: { $regex: req.query.search, $options: 'i' } }
    }
    const connectionMongoose = await mongoose.connect(environment.mongo_host, {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500
    });
    connectionMongoose.connection.db.collection(recurso, (err, collection) => {
        if (err) {
            return next(err);
        }
        collection.find(query, { projection: { nombre: 1 } }).toArray((err, data) => {
            if (err) {
                return next(err);
            }
            return res.json(data);
        });
    });
});
