import { MongoQuery, ResourceBase, ResourceNotFound } from '@andes/core';
import { ReportEvent } from './report-events.schema';
import { Request, Response } from '@andes/api-tool';
import { authenticate, checkPermission } from '../application';
import { InstitutionCtr } from '../institution/institution.controller'
import { getTokenByInstitucion } from '../collaborators/collaborators';
import { postNacion } from './report-events';

class ReportEvenResource extends ResourceBase {
    Model = ReportEvent;
    resourceName = 'report-events';
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
        type: MongoQuery.equalMatch,
        instituciones: {
            field: 'institucion.id',
            fn: (value) => {
                return { $in: value };
            }
        },
        search: ['nombre', 'key']
    };

    extrasRoutes = [
        {
            method: 'post',
            path: 'export',
            callback: 'export'
        }
    ];

    public async export(this: ReportEvenResource, req: Request, res: Response) {
        try {
            const re = req.body.reportEvent;
            const token = await getTokenByInstitucion(re.institucion.id);
            await postNacion(re.report, token, (re.report.type === 'children'));
            res.json(await this.update(re.id, { report: re.report }, req));
        } catch (err) {
            throw new ResourceNotFound();
        }
    }
}

export const ReportEventCtr = new ReportEvenResource();
export const ReportEventRouter = ReportEventCtr.makeRoutes();
