import { MongoQuery, ResourceBase } from '@andes/core';
import { authenticate } from '../application';
import { CovidEvents } from './covid-events.schema';

class CovidEventsResource extends ResourceBase {
    Model = CovidEvents;
    resourceName = 'covid-events';
    middlewares = [authenticate()];
    searchFileds = {
        ideventocaso: MongoQuery.equalMatch,
        evento: MongoQuery.partialString,
        search: ['nombre', 'ideventocaso', 'evento']
    };
}

export const CovidEventsCtr = new CovidEventsResource();
export const CovidEventsRouter = CovidEventsCtr.makeRoutes();