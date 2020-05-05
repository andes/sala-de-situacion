/**
 * Corre una Jobs de forma manual. Corre desde backend.
 *
 * node jobs/manual.js [Js File to run]
*/

import { Connections } from './../src/app/connection';

const path = require('path');

const done = () => {
    process.exit(0);
};
Connections.initialize();

const actionName = process.argv[2];
const action = require(path.join('..', actionName));

action.default(done);
