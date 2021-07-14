import { importCasesCovid } from '../src/app/covid-events/covid-events';
import { CovidEventsTemp } from '../src/app/covid-events/covid-events.schema';

async function run(done) {
    await importCasesCovid(done);
    await CovidEventsTemp.db.dropCollection('covid_events');
    await CovidEventsTemp.db.collection('covid_events_temp').rename('covid_events');
}

export default run;
