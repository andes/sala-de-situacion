import { environment } from '../../../environments/environment';
import { Email } from '../mail/mail.shema';
const nodemailer = require('nodemailer');

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string
}

export async function sendMail(options: MailOptions) {
    try {
        const transporter = await nodemailer.createTransport({
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
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                mailObject['status'] = 'error';
                mailObject['message'] = error;
                mailObject.save();
                return error
            }
            mailObject['message'] = 'Mail enviado correctamente';
            mailObject['status'] = 'success';
            mailObject.save();
            return info
        });
    } catch (err) {
        return err
    }
};