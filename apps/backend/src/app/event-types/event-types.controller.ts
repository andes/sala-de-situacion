import { MongoQuery, ResourceBase } from '@andes/core';
import { EventTypes } from './event-types.schema';
import { authenticate } from '../application';

class EventTypesResource extends ResourceBase {
    Model = EventTypes;
    resourceName = 'event-types';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        key: MongoQuery.partialString,
        institucion: MongoQuery.equalMatch,
        search: ['nombre', 'key']
    };
}

export const EventTypesCtr = new EventTypesResource();
export const EventTypesRoutes = EventTypesCtr.makeRoutes();
