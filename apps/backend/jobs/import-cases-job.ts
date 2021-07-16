import { importCasesCovid } from '../src/app/covid-events/covid-events';

async function run(done) {
    await importCasesCovid(done);
}

export default run;
