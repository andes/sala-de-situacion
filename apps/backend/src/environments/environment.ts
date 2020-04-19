export const environment = {
    production: false,
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    google_map_key: process.env.GOOGLE_KEY || 'AIzaSyC__of8PZKirB_IvkjzI7XTlfYtLieGRh0',
    key: process.env.JWT_KEY || 'jpfg1oayB2p7iaTAh7s790GuSsgal/mEF7A8jpnqpQQ=',
    // mongo_host: process.env.MONGO_HOST || 'mongodb://localhost:27017/sala-situacion',
    mongo_host:
        process.env.MONGO_HOST || 'mongodb://admin:golitoMon04@172.16.1.63:27017/sala-situacion?authSource=admin',
    mail: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: process.env.MAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER || 'info@andes.gob.ar',
            pass: process.env.MAIL_PASSWORD || 'x-6G9$ang`by'
        }
    },
    charts_embedding_base_url: 'http://172.16.1.63/mongodb-charts-zypoq'
};