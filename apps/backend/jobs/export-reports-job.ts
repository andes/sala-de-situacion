import { exportReports } from '../src/app/collaborators/collaborators';

async function run(done) {
    await exportReports(done);
}

export default run;
