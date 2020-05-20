import { MongoQuery, ResourceBase } from '@andes/core';
import { Charts } from './charts.schema';
import { authenticate } from '../application';
const crypto = require('crypto');
import { Request, Response } from '@andes/api-tool';

class ChartsResource extends ResourceBase {
    Model = Charts;
    resourceName = 'charts';
    middlewares = [authenticate()];

    searchFileds = {
        chart_id: MongoQuery.equalMatch,
        nombre: MongoQuery.partialString,
        activo: MongoQuery.equalMatch,
        search: ['nombre', 'categoria', 'activo'],
    };

    extrasRoutes = [
        {
            path: 'embedded/urls',
            callback: 'embeddedchart'
        }
    ];

    public async embeddedchart(this: ChartsResource, req: Request, res: Response, next) {
        try {
            const filtros = req.query.filter;
            delete req.query.filter;
            const select = req.query;
            const charts = await Charts.find(select);

            const urls = [];
            charts.forEach((chart: any) => {
                const timestamp = Math.floor(Date.now() / 1000);
                let payload = `id=${chart.chart_id}&tenant=${chart.tenant}&timestamp=${timestamp}`;
                if (chart.filter && filtros) {
                    const query = {};
                    const op = {};
                    op[chart.operator] = filtros.length > 0 && Array.isArray(filtros) ? filtros : [filtros];
                    query[chart.filter] = op;
                    payload += `&filter=${encodeURIComponent(JSON.stringify(query))}`;
                }
                if (chart.autorefresh) {
                    payload += `&autorefresh=${chart.autorefresh}&attribution=false`;
                }
                const hmac = crypto.createHmac('sha256', chart.embedding_signing_key);
                hmac.update(payload);
                const signature = hmac.digest('hex');
                urls.push({ url: `${chart.base_url}/embed/charts?${payload}&signature=${signature}`, cols: chart.cols });
            })
            return res.json(urls);

        } catch (err) {
            next(err);
        }
    }
}

export const ChartsCtr = new ChartsResource();
export const ChartsRouter = ChartsCtr.makeRoutes();
