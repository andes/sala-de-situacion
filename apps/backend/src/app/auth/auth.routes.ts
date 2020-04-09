import { application } from '../application';
import { UsersCtr } from '../users/user.controller';
import { Request } from '@andes/api-tool';
import { sendEmailValidacion, sendEmailRegeneration } from '../services/mail/mail';
import { Types } from 'mongoose';

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

AuthRouter.post('/auth/regenerate/:email', async (req: Request, res, next) => {
    try {
        const email = req.params.email;
        const updatedUser = await UsersCtr.setNewToken(email, req);
        await sendEmailRegeneration(email, updatedUser.nombre, updatedUser.validationToken);
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

AuthRouter.post('/auth/resetPassword', async (req: Request, res, next) => {
    try {
        const { password, validationToken } = req.body;
        const users = await UsersCtr.search({ token: validationToken, active: true }, {}, req);
        if (users.length > 0) {
            await UsersCtr.update(users[0].id, { password, validationToken: null }, req);
            return res.json({ status: 'ok' });
        } else {
            return res.json({ status: 404 });
        }
    } catch (err) {
        return next(403);
    }
});

