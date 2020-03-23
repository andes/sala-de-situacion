import { application } from '../application';
import { environment } from '../../environments/environment';
import { UsersCtr } from '../users/user.controller';
import { Request } from '@andes/api-tool';

export const AuthRouter = application.router();

AuthRouter.post('/login', async (req: Request, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const users = await UsersCtr.search({ email: email }, {}, req);
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
