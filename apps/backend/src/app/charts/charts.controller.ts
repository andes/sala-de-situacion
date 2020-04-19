import { MongoQuery, ResourceBase } from '@andes/core';
import { Charts } from './charts.schema';
import { authenticate } from '../application';

class ChartsResource extends ResourceBase {
    Model = Charts;
    resourceName = 'charts';
    middlewares = [authenticate()];
    searchFileds = {
        chart_id: MongoQuery.equalMatch,
        nombre: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        search: ['nombre', 'categoria']
    };
}

export const ChartsCtr = new ChartsResource();
export const ChartsRouter = ChartsCtr.makeRoutes();
