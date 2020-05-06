import { environment } from '../../../environments/environment';
import * as fs from 'fs';
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');


export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: any;
}

export interface HandlebarsData {
    titulo: string,
    usuario: any,
    url?: string,
    tipo?: 'sugerencia' | 'pregunta' | 'problema'
    contenido?: string,
}

export async function sendMail(options: MailOptions) {
    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    try {
        const transporter = await nodemailer.createTransport({
            host: environment.mail.host,
            port: environment.mail.port,
            secure: environment.mail.secure,
            auth: environment.mail.auth
        });

        return await transporter.sendMail(mailOptions);
    } catch (err) {
        return err;
    }
}

export function registerPartialTemplate(name: string) {
    const filePath = path.join(process.cwd(), `apps/backend/src/app/templates/email/${name}.html`);
    const file = fs.readFileSync(filePath);
    handlebars.registerPartial('partial', file.toString());
}

export function renderHTML(templateName: string, extras: any) {
    const TEMPLATE_PATH = 'apps/backend/src/app/templates/email/';
    const url = path.join(process.cwd(), TEMPLATE_PATH, templateName);

    const html = fs.readFileSync(url, { encoding: 'utf-8' });
    try {
        const template = handlebars.compile(html);
        const htmlToSend = template(extras);
        return htmlToSend;
    } catch (exp) {
        return exp;
    }
}

// Emails a usuarios
export async function sendUserEmail(data, tipo: 'account-activation' | 'password-reset' | 'user-suggestions') {
    const handlebarsData: HandlebarsData = {
        titulo: data.subject,
        usuario: data.user,
        url: data.url,
    };

    // Registra el template parcial de handlebars
    registerPartialTemplate(tipo);

    const html = await renderHTML('layout.html', handlebarsData);

    const mail: MailOptions = {
        from: `"Sala de Situación" <${environment.mail.auth.user}>`,
        to: handlebarsData.usuario.email,
        subject: handlebarsData.titulo,
        html
    };

    return sendMail(mail);
}


// Emails de sistema
export async function sendAdminEmail(body) {

    const handlebarsData: HandlebarsData = {
        titulo: 'Preguntas y sugerencias',
        tipo: body.tipo,
        usuario: body.user,
        contenido: body.contenido,
    };

    // Registra el template parcial de handlebars
    registerPartialTemplate('user-suggestions');

    const html = await renderHTML('layout.html', handlebarsData);
    const mail: MailOptions = {
        from: `"Sala de Situación" <${handlebarsData.usuario.email}>`,
        to: environment.mail.auth.user,
        subject: handlebarsData.titulo,
        html
    }

    return sendMail(mail);
};
