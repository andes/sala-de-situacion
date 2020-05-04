import * as exportador from '../src/app/exportador/ExportadorNacion';

function run(done) {
    exportador.login("admin@admin.com", "admin")
        .then(done)
        .catch(done);
}

export default run;

