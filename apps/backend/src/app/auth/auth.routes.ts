import { application } from '../application';
import { UsersCtr } from '../users/user.controller';
import { Request } from '@andes/api-tool';
import { sendEmailNotification } from '../services/mail/mail';
import { sendEmailSuggestion } from '../services/mail/mail';
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
    const url = `${environment.app_host}/auth/activacion-cuenta/${createdUser.validationToken}`;
    await sendEmailNotification(user.email, user.nombre, 'SALA DE SITUACIÓN :: Verificación de cuenta', `${user.nombre}, gracias por registrar tu cuenta. Para activarla haz click aquí ${url}`);
    return res.json({ status: 'ok' });
  } catch (err) {
    return next(403);
  }
});

AuthRouter.post('/auth/regenerate/:email', async (req: Request, res, next) => {
  try {
    const email = req.params.email;
    const updatedUser = await UsersCtr.setNewToken(email, req);
    const url = `${environment.app_host}/auth/regenerate-password/${updatedUser.validationToken}`;
    await sendEmailNotification(email, updatedUser.nombre, 'SALA DE SITUACIÓN :: Regenerar contraseña', `Hola ${updatedUser.nombre}, para regenerar la contraseña de tu cuenta por favor hacer clic aquí: ${url}`);
    return res.json({ status: 'ok' });
  } catch (err) {
    return next(403);
  }
});

AuthRouter.post('/auth/suggestions/:email', async (req: Request, res, next) => {
  try {
    const email = req.params.email;
    const user = req.body.user;
    const suggestion = req.body.suggestion;
    await sendEmailSuggestion(email, 'SALA DE SITUACIÓN :: Nueva pregunta/sugerencia', `Se ha recibido una sugerencia del usuario ${user.apellido}, ${user.nombre}. Sugerencia: ${suggestion}`);
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

AuthRouter.get('/auth/session', application.authenticate(), async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const user = await UsersCtr.findById(user_id, { fields: 'nombre apellido telefono email documento permisos active' });
    res.json(user);

  } catch (err) {
    return next(403);
  }
});
