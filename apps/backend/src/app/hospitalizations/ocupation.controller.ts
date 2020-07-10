import { MongoQuery, ResourceBase, ResourceNotFound } from '@andes/core';

import { authenticate } from '../application';
import { Ocupation } from './ocupation.schema';
import { environment } from '../../environments/environment';
import { Request, Response } from '@andes/api-tool';
const fetch = require('node-fetch');

class OcupationResource extends ResourceBase {
    Model = Ocupation;
    resourceName = 'ocupations';
    middlewares = [authenticate()];
    searchFileds = {
        fechaIngreso: MongoQuery.equalMatch,
        apellido: MongoQuery.partialString,
        nombre: MongoQuery.partialString,
        dni: MongoQuery.partialString,
        respirador: MongoQuery.equalMatch,
        covid: MongoQuery.equalMatch,
        tipo: MongoQuery.equalMatch,
        nroArchivo: MongoQuery.equalMatch
    };

    extrasRoutes = [
        {
            path: 'export/:nroArchivo',
            callback: 'exportOcupations'
        }
    ];

    public async exportOcupations(this: OcupationResource, req: Request, res: Response) {
        try {
            const url = `${environment.bi_query_host}/queries/sala-ocupations/export`;
            const archivo = req.params.nroArchivo;
            const data = {
                params: {
                    nroArchivo: archivo
                }
            };
            const headers = {
                'Content-Type': 'application/json'
            };
            await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
            return res.json({ status: 'ok' });
        }
        catch (err) {
            throw new ResourceNotFound();
        }
    }

}

export const OcupationCtr = new OcupationResource();
export const OcupationsRouter = OcupationCtr.makeRoutes();
