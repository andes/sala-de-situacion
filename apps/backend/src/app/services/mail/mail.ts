import { environment } from '../../../environments/environment';
const nodemailer = require('nodemailer');

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string
}

export async function sendMail(options: MailOptions) {

    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text
    };

    try {
        const transporter = await nodemailer.createTransport({
            host: environment.mail.host,
            port: environment.mail.port,
            secure: environment.mail.secure,
            auth: environment.mail.auth,
        });

        return await transporter.sendMail(mailOptions);


    } catch (err) {
        return err
    }
};