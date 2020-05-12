import { application } from '../application';
import { UsersCtr } from '../users/user.controller';
import { Request } from '@andes/api-tool';
import { sendUserEmail } from '../services/mail/mail';
import { sendAdminEmail } from '../services/mail/mail';
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

        const createdUser = await UsersCtr.create(req.body, req);
        const data = {
            user: createdUser,
            url: `${environment.app_host}/auth/activacion-cuenta/${createdUser.validationToken}`,
            subject: 'Activación de cuenta'
        }

        await sendUserEmail(data, 'account-activation');

        return res.json({ status: 'ok' });
    } catch (err) {
        return next(403);
    }
});

AuthRouter.post('/auth/regenerate/:email', async (req: Request, res, next) => {
    try {
        const email = req.params.email;
        const updatedUser = await UsersCtr.setNewToken(email, req);

        const data = {
            user: updatedUser,
            url: `${environment.app_host}/auth/regenerate-password/${updatedUser.validationToken}`,
            subject: 'Regenerar contraseña'
        }

        await sendUserEmail(data, 'password-reset');

        return res.json({ status: 'ok' });
    } catch (err) {
        return next(403);
    }
});

AuthRouter.post('/auth/suggestions', application.authenticate(), async (req: Request, res, next) => {
    try {
        await sendAdminEmail(req.body);
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
        const users = await UsersCtr.search({ validationToken: validationToken, active: true }, {}, req);
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

AuthRouter.post('/auth/updatePassword', application.authenticate(), async (req: Request, res, next) => {
    try {
        const { password, user_id } = req.body;
        const user = await UsersCtr.findById(user_id, {});
        if (user) {
            await UsersCtr.update(user.id, { password }, req);
            return res.json({ status: 'ok' });
        } else {
            return res.json({ status: 404 });
        }
    } catch (err) {
        return next(403);
    }
});

AuthRouter.get('/auth/session', application.authenticate(), async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const user = await UsersCtr.findById(user_id, { fields: 'nombre apellido telefono email documento permisos active' });
        res.json(user);

    } catch (err) {
        return next(403);
    }
});
