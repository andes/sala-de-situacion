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
        nroArchivo: MongoQuery.equalMatch,
        institution: {
            field: 'institution.id',
            fn: (value) => value
        },
        fecha: {
            field: 'createdAt',
            fn: (value) => (MongoQuery.matchDate(value))
        },
        exportado: MongoQuery.equalMatch,
        search: ['institution', 'fecha', 'exportado']
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
            // Elimina el archivo en el sql
            const urlDelete = `${environment.bi_query_host}/queries/sala-checkouts/delete`;
            await fetch(urlDelete, { method: 'POST', headers: headers, body: JSON.stringify(data) });
            // Exporta los archivos
            const response = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
            if (response.status == 400) {
                // Realiza un nuevo intento
                await fetch(urlDelete, { method: 'POST', headers: headers, body: JSON.stringify(data) });
                await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
            } else {
                const ocupaciones = await OcupationCtr.search({ nroArchivo: archivo });
                ocupaciones.forEach(async ocupacion => {
                    ocupacion.exportado = true;
                    await ocupacion.save();
                });
                return res.json({ status: 'ok' });
            }
        }
        catch (err) {
            throw new ResourceNotFound();
        }
    }

}

export const OcupationCtr = new OcupationResource();
export const OcupationsRouter = OcupationCtr.makeRoutes();
