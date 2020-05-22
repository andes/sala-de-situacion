import { Connections } from '../../connection';
import { Logger } from '@andes/log';

export const covidEventsLog = new Logger({ connection: Connections.logs, module: 'covid-events', type: 'import', application: 'sala-de-situacion' });
