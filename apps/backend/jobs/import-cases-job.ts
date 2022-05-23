import { importCasesCovidDate } from '../src/app/covid-events/covid-events';

async function run(done) {
    await importCasesCovidDate(done, 2);
}

export default run;