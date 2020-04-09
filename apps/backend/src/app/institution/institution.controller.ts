import { MongoQuery, ResourceBase } from '@andes/core';
import { Institution } from './institution.schema';
import { authenticate } from '../application';
import * as mongoose from 'mongoose';

class InstitutionResource extends ResourceBase {
    Model = Institution;
    resourceName = 'institution';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        direccion: MongoQuery.partialString,
        provincia: MongoQuery.partialString,
        localidad: MongoQuery.partialString,
        tipoInstitucion: MongoQuery.partialString,
        zona: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        user: {
            field: 'users.id',
            fn: value => mongoose.Types.ObjectId(value)
        },
        search: ['nombre', 'direccion', 'zona', 'tipoInstitucion', 'provincia', 'localidad']
    };
}

export const InstitutionCtr = new InstitutionResource();
export const InstitutionRouter = InstitutionCtr.makeRoutes();
