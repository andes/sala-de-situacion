import { MongoQuery, ResourceBase } from '@andes/core';
import { Event } from './event.schema';
import { authenticate, checkPermission } from '../application';
import { Request, Response } from '@andes/api-tool';

class EventsResource extends ResourceBase {
    Model = Event;
    resourceName = 'events';
    middlewares = [authenticate()];
    routesAuthorization = {
        post: (req: Request, res: Response, next) => {
            const permisoAdmin = checkPermission(req, 'admin:true');
            if (!permisoAdmin) {
                return next(403);
            }
            return next();

        },
        search: (req: Request, res: Response, next) => {
            const permisoAdmin = checkPermission(req, 'admin:true');
            if (!permisoAdmin) {
                return next(403);
            }
            return next();

        }
    };
    searchFileds = {
        nombre: MongoQuery.partialString,
        categoria: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        search: ['nombre', 'categoria'],
        indicadores: {
            field: 'indicadores.key',
            fn: value => value
        }
    };
}

export const EventsCtr = new EventsResource();
export const EventsRouter = EventsCtr.makeRoutes();
