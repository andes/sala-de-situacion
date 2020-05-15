import { MongoQuery, ResourceBase } from '@andes/core';
import { Disclaimer } from './disclaimer.schema';

import { authenticate } from '../application';

class DisclaimerResource extends ResourceBase {
    Model = Disclaimer;
    resourceName = 'disclaimers';
    middlewares = [authenticate()];
    searchFileds = {
        version: MongoQuery.partialString,
        activo: MongoQuery.equalMatch
    };
}

export const DisclaimerCtr = new DisclaimerResource();
export const DisclaimersRouter = DisclaimerCtr.makeRoutes();
