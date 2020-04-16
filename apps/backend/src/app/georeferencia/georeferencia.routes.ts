import { geoReferenciar } from '@andes/georeference'
import { application } from '../application';
import { environment } from '../../environments/environment'

export const GeoreferenciaRouter = application.router();


GeoreferenciaRouter.get('/georeferencia', async (req: any, res, next) => {
    if (req.query.direccion) {
        try {
            const resultado = await geoReferenciar(req.query.direccion, environment.GOOGLE_MAP_KEY);
            res.json(resultado);
        } catch (err) {
            return next(err);
        }
    } else {
        return next('Parámetros incorrectos');
    }
});

