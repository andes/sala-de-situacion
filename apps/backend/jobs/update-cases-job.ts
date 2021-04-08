import { updateCasesCovid } from '../src/app/covid-events/covid-events';
import * as moment from 'moment';

async function run(done) {
    const date = moment().startOf('day').toDate();
    await updateCasesCovid(done, date);
}

export default run;
