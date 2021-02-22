import { MongoQuery, ResourceBase } from '@andes/core';
import { InscripcionVacuna } from './inscripcion-vacunas.schema';

class InscripcionVacunasResource extends ResourceBase {
    Model = InscripcionVacuna;
    resourceName = 'inscripcion-vacunas';
    routesEnable = ['get', 'search'];
    searchFileds = {
        documento: MongoQuery.equalMatch,
        nombre: MongoQuery.partialString,
        apellido: MongoQuery.partialString,
        sexo: MongoQuery.equalMatch
    };
}

export const InscripcionVacunasCtr = new InscripcionVacunasResource();
export const InscripcionVacunasRouter = InscripcionVacunasCtr.makeRoutes();
