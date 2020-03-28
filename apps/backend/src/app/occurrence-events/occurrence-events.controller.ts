import { MongoQuery, ResourceBase } from '@andes/core';
import { OcurrenceEvent } from './occurrence-events.schema';
import { authenticate } from '../application';

class OcurrenceEventResource extends ResourceBase {
    Model = OcurrenceEvent;
    resourceName = 'ocurrence-event';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        key: MongoQuery.partialString,
        institucion: MongoQuery.equalMatch,
        search: ['nombre', 'key']
    };
}

export const OcurrenceEventCtr = new OcurrenceEventResource();
export const OcurrenceEventRoutes = OcurrenceEventCtr.makeRoutes();