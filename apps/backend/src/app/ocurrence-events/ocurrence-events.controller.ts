import { MongoQuery, ResourceBase } from '@andes/core';
import { OcurrenceEvent } from './ocurrence-events.schema';
import { Request, Response } from '@andes/api-tool';
import { authenticate, checkPermission } from '../application';
import { InstitutionCtr } from '../institution/institution.controller'
import * as mongoose from 'mongoose';

class OcurrenceEventResource extends ResourceBase {
    Model = OcurrenceEvent;
    resourceName = 'ocurrence-events';
    middlewares = [authenticate()];
    routesAuthorization = {
        // Agrega un middlware
        search: async (req: Request, res: Response, next) => {
            const permisoAdmin = checkPermission(req, 'admin:true');
            if (!permisoAdmin) {
                if (req.user) {
                    const instituciones = await InstitutionCtr.search({ user: req.user._id }, {}, req);
                    req.query.instituciones = instituciones.map(i => i._id);
                }
            }
            return next();

        }
    };
    searchFileds = {
        nombre: MongoQuery.partialString,
        eventKey: MongoQuery.partialString,
        institucion: MongoQuery.equalMatch,
        instituciones: {
            field: 'institucion.id',
            fn: (value) => {
                return { $in: value.map(i => mongoose.Types.ObjectId(i._id)) };
            }
        },
        search: ['nombre', 'key']
    };
}

export const OcurrenceEventCtr = new OcurrenceEventResource();
export const OcurrenceEventRoutes = OcurrenceEventCtr.makeRoutes();
