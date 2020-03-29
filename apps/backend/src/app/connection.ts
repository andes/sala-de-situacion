import * as mongoose from 'mongoose';
import * as debug from 'debug';

import { environment } from '../environments/environment';

function schemaDefaults(schema) {
    schema.set('toJSON', {
        virtuals: true,
        versionKey: false
    });
}

export class Connections {
    static main: mongoose.Connection;

    /**
     * Inicializa las conexiones a MongoDB
     *
     * @static
     *
     * @memberOf Connections
     */
    static initialize() {
        // Configura Mongoose
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mongoose as any).Promise = global.Promise;
        mongoose.plugin(schemaDefaults);

        // Configura logger de consultas
        const queryLogger = debug('mongoose');
        if (queryLogger.enabled) {
            mongoose.set('debug', (collection, method, query, arg1, arg2, arg3) =>
                queryLogger('%s.%s(%o) %s %s', collection, method, query, arg2 || '', arg3 || '')
            );
        }

        // Conecta y configura conexiones
        // 1. PRINCIPAL
        mongoose.connect(environment.mongo_host, {
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500
        });
        this.main = mongoose.connection;

        // Configura eventos
        this.configEvents('main', this.main);
    }

    private static configEvents(name: string, connection: mongoose.Connection) {
        const connectionLog = debug(`mongoose: ${name}`);
        connection.on('connecting', () => connectionLog('connecting ...'));
        connection.on('error', error => connectionLog(`error: ${error}`));
        connection.on('connected', () => connectionLog('connected'));
        connection.on('reconnected', () => connectionLog('reconnected'));
        connection.on('disconnected', () => connectionLog('disconnected'));
    }
}
