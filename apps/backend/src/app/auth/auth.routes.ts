import { application } from '../application';
import { UsersCtr } from '../users/user.controller';
import { Request } from '@andes/api-tool';
import { sendEmailValidacion } from '../services/mail/mail';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { environment } from '../../environments/environment';

export const AuthRouter = application.router();

AuthRouter.post('/auth/login', async (req: Request, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const users = await UsersCtr.search({ email: email, active: true }, {}, req);
        if (users.length > 0) {
            const user = users[0];
            const match = await user.comparePassword(password);
            if (match) {
                const session = new Types.ObjectId();
                const newToken = await application.sign({
                    session_id: session.toHexString(),
                    user_id: user._id.toHexString()
                });
                return res.json({ token: newToken });
            }
        }
        return next(403);
    } catch (err) {
        return next(403);
    }
});

AuthRouter.post('/auth/create', async (req: Request, res, next) => {
    try {
        const user = req.body;
        const createdUser = await UsersCtr.create(user, req);
        //Se realiza el envio del mail de verificación de la cuenta junto con el token de validación
        await sendEmailValidacion(user.email, user.nombre, createdUser.validationToken);
        return res.json({ status: 'ok' });
    } catch (err) {
        return next(403);
    }
});

AuthRouter.post('/auth/validate/:token', async (req: Request, res, next) => {
    try {
        const token = req.params.token;
        await UsersCtr.validateUser(token, req);
        return res.json({ status: 'ok' });
    } catch (err) {
        return next(403);
    }
});

AuthRouter.get('/auth/usuario/:token', async (req: Request, res, next) => {
    try {
        const token = req.params.token;
        const tokenData: any = jwt.verify(token, environment.key);
        const user = await UsersCtr.findById(tokenData.user_id, {});
        return res.json(user);
    } catch (err) {
        return next(403);
    }
});
