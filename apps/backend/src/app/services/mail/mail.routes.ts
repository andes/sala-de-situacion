import { application } from '../../application';
import { Request } from '@andes/api-tool';
import { environment } from 'apps/backend/src/environments/environment';
import { sendMail, MailOptions } from '../mail/mail';
import { doesNotThrow } from 'assert';

export const MailRouter = application.router();

MailRouter.post('/sendMail', async (req: Request, res, next) => {
    try {
        if (!req.body.email) {
            res.status(422).send({ error: 'Se debe ingresar una dirección de mail' });
        }
        let options: MailOptions = {
            from: environment.mail.auth.user,
            to: req.body.email,
            subject: req.body.asunto,
            text: req.body.texto
        };
        await sendMail(options);
        return res.json(200);

    } catch (err) {
        return next(403);
    }
});