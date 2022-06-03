import { updateCasesCovid } from '../src/app/covid-events/covid-events';
import * as moment from 'moment';

async function run(done) {
    const date = moment().startOf('day').toDate();
    await updateCasesCovid(date);
    done();
}

export default run;
