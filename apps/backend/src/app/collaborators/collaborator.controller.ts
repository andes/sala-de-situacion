import { MongoQuery, ResourceBase } from '@andes/core';
import { Collaborator } from './collaborator.schema';
import { authenticate } from '../application';

class CollaboratorResource extends ResourceBase {
    Model = Collaborator;
    resourceName = 'collaborator';
    middlewares = [authenticate()];
    searchFileds = {
        email: MongoQuery.partialString,
        user: MongoQuery.equalMatch,
        search: ['email']
    };
}

export const CollaboratorCtr = new CollaboratorResource();
export const CollaboratorRouter = CollaboratorCtr.makeRoutes();
