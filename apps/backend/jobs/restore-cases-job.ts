import { updateCasesCovid } from '../src/app/covid-events/covid-events';
import * as moment from 'moment';

async function run(done) {
    const desde = process.argv[3];
    const date = moment(desde).startOf('day');

    while (moment().diff(date, 'days') <= 0) {
        await updateCasesCovid(done, date);
        date.add(1, 'days');
    }
}

export default run;
