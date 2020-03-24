
import { MongoQuery, ResourceBase } from '@andes/core';
import { Institution } from './institution.schema';
import { authenticate } from '../application';

class InstitutionResource extends ResourceBase {
    Model = Institution;
    resourceName = 'institutions';
    middlewares = [authenticate()];
    searchFileds = {
        nombre: MongoQuery.partialString,
        direccion: MongoQuery.partialString,
        provincia: MongoQuery.partialString,
        localidad: MongoQuery.partialString,
        tipoInstitutcion: MongoQuery.partialString,
        zona: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        search: ['nombre', 'direccion', 'zona', 'tipoInstitucion', 'provincia', 'localidad']
    };
}

export const InstitutionCtr = new InstitutionResource();
export const InstitutionRouter = InstitutionCtr.makeRoutes();
