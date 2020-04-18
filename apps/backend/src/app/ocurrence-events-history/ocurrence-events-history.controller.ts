import { MongoQuery, ResourceBase } from '@andes/core';
import { OcurrenceEventHistory } from './ocurrence-events-history.schema';
import { authenticate } from '../application';

class OcurrenceEventHistoryResource extends ResourceBase {
    Model = OcurrenceEventHistory;
    resourceName = 'ocurrence-events-history';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        key: MongoQuery.partialString,
        institucion: MongoQuery.equalMatch,
        originalRef: MongoQuery.equalMatch,
        search: ['nombre', 'key']
    };
}

export const OcurrenceEventHistoryCtr = new OcurrenceEventHistoryResource();
export const OcurrenceEventHistoryRoutes = OcurrenceEventHistoryCtr.makeRoutes();
