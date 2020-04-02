import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-global';
import { environment } from '../../environments/environment';
const request = require('supertest');
import { EventsCtr, EventsRouter } from './event.controller';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer: any;
let app;
const { application } = require('../application');
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    environment.mongo_host = mongoUri;

    const { Connections } = require('../connection');
    Connections.initialize();
    application.add({ path: '/api', router: EventsRouter });
    application.start();
    app = application.expressApp;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await application.stop();
});

describe('Event - Test', () => {
    it('create evento', () => {
        const evento = {
            activo: false,
            nombre: 'Registro de cama',
            categoria: 'Cama',
            indicadores: [
                {
                    key: 'camas_disponibles',
                    label: 'cantidad de camas disponibles',
                    type: 'number',
                    min: 0,
                    max: 200,
                    required: true
                },
                {
                    key: 'camas_ocupadas',
                    label: 'cantidad de camas ocupadas',
                    type: 'number',
                    min: 0,
                    max: 200,
                    required: true
                }
            ]
        };
        return request(app)
            .post('/api/events')
            .send(evento)
            .set('Accept', 'application/json')
            .expect(200)
            .then(async () => {
                const eventos = await EventsCtr.search({ categoria: evento.categoria }, {}, null);
                expect(eventos.length).toBe(1);
            });
    });
});
