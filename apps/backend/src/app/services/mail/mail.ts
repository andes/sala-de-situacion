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
  html?: string;
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

export async function sendEmailNotification(email: string, nombre: string, subject, text) {
  const mail: MailOptions = {
    from: environment.mail.auth.user,
    to: email,
    subject: subject,
    text: text
  };
  return sendMail(mail);
}

export async function sendEmailSuggestion(body) {

  const handlebarsData = {
    usuario: body.user,
    contenido: body.contenido,
    tipo: body.tipo
  };

  console.log(handlebarsData.usuario.email);

  renderHTML('suggestions.html', handlebarsData).then((html) => {
    const mail: MailOptions = {
      from: `Sala de Situación <${environment.mail.auth.user}>`,
      to: handlebarsData.usuario.email,
      subject: 'Sala de situación ~ Preguntas y sugerencias',
      text: '',
      html
    }
    return sendMail(mail);
  });
};

export function renderHTML(templateName: string, extras: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const TEMPLATE_PATH = 'apps/backend/src/app/templates/email/';
    const url = path.join(process.cwd(), TEMPLATE_PATH, templateName);

    fs.readFile(url, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        return reject(err);
      }
      try {
        const template = handlebars.compile(html);
        const htmlToSend = template(extras);
        return resolve(htmlToSend);
      } catch (exp) {
        return reject(exp);
      }

    });
  });
}
