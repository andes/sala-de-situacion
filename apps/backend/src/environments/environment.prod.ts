export const environment = {
  production: true,
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  google_map_key: process.env.GOOGLE_KEY || 'unacalve',
  app_host: process.env.APP_HOST || 'https://salasituacion.andes.gob.ar',
  key: process.env.JWT_KEY || null,
  mongo_host: process.env.MONGO_HOST || 'mongodb://localhost:27017/sala-situacion',
  mail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER || 'mail@mail.gob.ar',
      pass: process.env.MAIL_PASSWORD || 'somePass'
    }
  }

};
