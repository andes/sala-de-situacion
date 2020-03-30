import { application } from '../application';
import { UsersCtr } from '../users/user.controller';
import { Request } from '@andes/api-tool';
import { sendEmailValidacion } from '../services/mail/mail';

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
                const newToken = await application.sign({
                    user_id: user._id,
                    permisos: user.permisos
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
    await UsersCtr.create(user, req);
    //Se realiza el envio del mail de verificación de la cuenta
    await sendEmailValidacion(user.email, user.nombre);
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


AuthRouter.post('/auth/activate', async (req: Request, res, next) => {
  try {
    const email = req.body.email;
    const users = await UsersCtr.search({ email: email }, {}, req);
    if (users && users[0]) {
      const user = users[0];
      await UsersCtr.update(user.id, { active: true }, req);
      return res.json({ status: 'ok' });
    } else {
      return next(403);
    }

  } catch (err) {
    return next(403);
  }
});


