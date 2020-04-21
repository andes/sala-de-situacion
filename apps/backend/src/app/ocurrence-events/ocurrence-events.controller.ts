import { MongoQuery, ResourceBase } from '@andes/core';
import { OcurrenceEvent } from './ocurrence-events.schema';
import { Request, Response } from '@andes/api-tool';
import { authenticate, checkPermission } from '../application';
import { InstitutionCtr } from '../institution/institution.controller'
import * as mongoose from 'mongoose';
import { OcurrenceEventHistory } from '../ocurrence-events-history/ocurrence-events-history.schema';
import { OcurrenceEventHistoryCtr } from '../ocurrence-events-history/ocurrence-events-history.controller';

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

        },
        post: async (req: Request, res: Response, next) => {
            const doc = req.body;
            const eventHistory: OcurrenceEventHistory = {
                eventKey: doc.eventKey,
                activo: doc.activo,
                fecha: doc.fecha,
                institucion: doc.institucion,
                indicadores: doc.indicadores,
                originalRef: doc._id
            };
            const ocurrenceEventHistory = new OcurrenceEventHistory(eventHistory);
            await OcurrenceEventHistoryCtr.create(ocurrenceEventHistory, req);
            return next();
        },
        patch: async (req: Request, res: Response, next) => {
            const doc = req.body;
            const eventHistory: OcurrenceEventHistory = {
                eventKey: doc.eventKey,
                activo: doc.activo,
                fecha: doc.fecha,
                institucion: doc.institucion,
                indicadores: doc.indicadores,
                originalRef: doc._id
            };
            const ocurrenceEventHistory = new OcurrenceEventHistory(eventHistory);
            await OcurrenceEventHistoryCtr.create(ocurrenceEventHistory, req);
            return next();
        }
    };
    searchFileds = {
        nombre: MongoQuery.partialString,
        key: MongoQuery.partialString,
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
