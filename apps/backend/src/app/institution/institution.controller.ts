import { MongoQuery, ResourceBase } from '@andes/core';
import { Request, Response } from '@andes/api-tool';
import { Institution } from './institution.schema';
import { authenticate, checkPermission } from '../application';
import * as mongoose from 'mongoose';

class InstitutionResource extends ResourceBase {
    Model = Institution;
    resourceName = 'institution';
    middlewares = [authenticate()];
    routesAuthorization = {
        // Agrega un middlware
        post: (req: Request, res: Response, next) => {
            const permisoAdmin = checkPermission(req, 'admin:true');
            if (!permisoAdmin) {
                if (req.user) {
                    req.body.users = [req.user];
                }
            }
            return next();
        },
        search: (req: Request, res: Response, next) => {
            const permisoAdmin = checkPermission(req, 'admin:true');
            if (!permisoAdmin) {
                if (req.user) {
                    req.query.user = req.user._id;
                }
            }
            return next();
        }
    };
    searchFileds = {
        nombre: MongoQuery.partialString,
        direccion: MongoQuery.partialString,
        provincia: MongoQuery.partialString,
        localidad: MongoQuery.partialString,
        tipoInstitucion: MongoQuery.partialString,
        zona: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        user: {
            field: 'users._id',
            fn: value => mongoose.Types.ObjectId(value)
        },
        search: ['nombre', 'direccion', 'zona', 'tipoInstitucion', 'provincia', 'localidad']
    };
}

export const InstitutionCtr = new InstitutionResource();
export const InstitutionRouter = InstitutionCtr.makeRoutes();
