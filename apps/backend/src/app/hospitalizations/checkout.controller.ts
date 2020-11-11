import { MongoQuery, ResourceBase, ResourceNotFound } from '@andes/core';
import { authenticate } from '../application';
import { Checkout } from './checkout.schema';
import { environment } from '../../environments/environment';
import { Request, Response } from '@andes/api-tool';
const fetch = require('node-fetch');

class CheckoutResource extends ResourceBase {
    Model = Checkout;
    resourceName = 'checkouts';
    middlewares = [authenticate()];
    searchFileds = {
        fechaEgreso: MongoQuery.equalMatch,
        fechaIngreso: MongoQuery.equalMatch,
        apellido: MongoQuery.partialString,
        nombre: MongoQuery.partialString,
        dni: MongoQuery.partialString,
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
        search: ['institution', 'fecha']
    };
    extrasRoutes = [
        {
            path: 'export/:nroArchivo',
            callback: 'exportCheckout'
        }
    ];

    public async exportCheckout(this: CheckoutResource, req: Request, res: Response) {
        try {
            const url = `${environment.bi_query_host}/queries/sala-checkouts/export`;
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
        } catch (err) {
            throw new ResourceNotFound();
        }
    }

}


export const CheckoutCtr = new CheckoutResource();
export const CheckoutsRouter = CheckoutCtr.makeRoutes();
