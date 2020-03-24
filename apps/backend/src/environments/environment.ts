export const environment = {
  production: false,
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  key: process.env.JWT_KEY || 'jpfg1oayB2p7iaTAh7s790GuSsgal/mEF7A8jpnqpQQ=',
  mongo_host:
    process.env.MONGO_HOST || 'mongodb://localhost:27017/sala-situacion'
};
