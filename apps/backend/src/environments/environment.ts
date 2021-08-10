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
            host: process.env.MONGO_LOGS || 'mongodb://localhost:27017/sala-situacion-logs',
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
    exportadorHost: process.env.HOST_EXPORTADOR || '',
    bi_query_host: process.env.BI_QUERY_HOST || 'http://localhost:4000',
    conSql: {
        auth: {
            user: process.env.USER_SQL || 'prueba',
            password: process.env.PASS_SQL || 'unapass'
        },
        serverSql: {
            server: process.env.HOST_SQL || 'prueba',
            database: process.env.DB_SQL || 'db'
        },
        pool: {
            acquireTimeoutMillis: 15000
        }
    }
};

export const jobs = [
    {
        when: '0 06,18 * * *',
        action: 'jobs/import-cases-job'
    },
    {
        when: '0 */5 * * *',
        action: 'jobs/import-indicadores-job'
    },
    {
        when: '0 */6 * * *',
        action: 'jobs/export-reports-job'
    }
];


