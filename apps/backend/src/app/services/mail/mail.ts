import { environment } from '../../../environments/environment';
import { Email } from '../mail/mail.shema';
const nodemailer = require('nodemailer');

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string
}

export function sendMail(options: MailOptions) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: environment.mail.host,
            port: environment.mail.port,
            secure: environment.mail.secure,
            auth: environment.mail.auth,
        });

        const mailOptions = {
            from: options.from,
            to: options.to,
            subject: options.subject,
            text: options.text
        };
        let mailObject = new Email({
            email: mailOptions.to,
            subject: mailOptions.subject,
            from: mailOptions.from,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                mailObject['status'] = 'error';
                mailObject['message'] = error;
                mailObject.save();
                return reject(error);
            }
            mailObject['message'] = 'Mail enviado correctamente';
            mailObject['status'] = 'success';
            mailObject.save();
            return resolve(info);
        });
    });
};