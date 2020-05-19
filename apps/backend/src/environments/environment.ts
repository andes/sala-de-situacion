export const environment = {
    production: false,
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    app_host: process.env.APP_HOST || 'https://salasituacion.andes.gob.ar',
    google_map_key: process.env.GOOGLE_KEY || 'unacalve',
    key: process.env.JWT_KEY || 'jpfg1oayB2p7iaTAh7s790GuSsgal/mEF7A8jpnqpQQ=',
    mongo_host: process.env.MONGO_HOST || 'mongodb://localhost:27017/sala-situacion',
    logDatabase: {
        log: {
            host: process.env.MONGO_LOGS || 'mongodb://localhost:27017/andesLogs',
            options: {
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1500,
                useNewUrlParser: true
            }
        }
    },
    mail: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: process.env.MAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER || 'mail@mail.com',
            pass: process.env.MAIL_PASSWORD || 'unaPass'
        }
    },
    snvs: {
        host: process.env.HOST_SNVS || 'prueba',
        user: process.env.USER_SNVS || 'user',
        pass: process.env.PASS_SNVS || 'unapass'
    },
    exportadorHost: process.env.HOST_EXPORTADOR || ''
};

export const jobs = [
    {
        when: '*/5 * * * * * ',
        action: '../../jobs/import-cases-job'
    }];

