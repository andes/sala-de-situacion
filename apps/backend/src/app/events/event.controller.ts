import { MongoQuery, ResourceBase, ResourceNotFound } from '@andes/core';
import { Event } from './event.schema';
import { authenticate } from '../application';

class EventsResource extends ResourceBase {
    Model = Event;
    resourceName = 'events';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        categoria: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        search: ['nombre', 'categoria', 'activo'],
        indicadores: {
            field: 'indicadores.key',
            fn: (value) => value
        }
    }
}

export const EventsCtr = new EventsResource();
export const EventsRouter = EventsCtr.makeRoutes();