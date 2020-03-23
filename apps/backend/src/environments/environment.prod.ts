export const environment = {
  production: true,
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  key: process.env.JWT_KEY || null,
  mongo_host: process.env.MONGO_HOST || 'mongodb://localhost:27017'
};
