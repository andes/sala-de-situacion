/**
 * Corre una Jobs de forma manual. Corre desde el root del proyecto.
 *
 * node jobs/manual.js [Js File to run]
*/


const path = require('path');

const done = () => {
    process.exit(0);
};

const actionName = process.argv[2];
const action = require(path.join('..', actionName));

action.default(done);
