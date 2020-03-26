import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-global';
import { environment } from '../../../environments/environment';
const request = require('supertest');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer: any;
let app;
const { application } = require('../application');
beforeAll(async () => {
    const { Connections } = require('../connection');

    Connections.initialize();
    const MailRouter = require('./mail.routes').MailRouter;
    application.add({ path: '/api/mail', router: MailRouter });
    application.start();

    app = application.expressApp;
});

afterAll(async () => {
    await application.stop();
});

describe('MAIL - Test', () => {

    it('send an email', () => {

        const data = {
            email: 'h@f.com',
            asunto: 'Sala de situación',
            texto: 'Robot de sala de situación...'
        }
        return request(app)
            .post('/api/mail/sendMail')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200);
    });
});