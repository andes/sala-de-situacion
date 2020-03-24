require('dotenv').config();
const { Connections } = require('./app/connection');
const { application } = require('./app/application');

Connections.initialize();

const UsersRouter = require('./app/users/user.controller').UsersRouter;
const AuthRouter = require('./app/auth/auth.routes').AuthRouter;
const InstitutionsRouter = require('./app/institution/institution.controller').InstitutionRouter;

application.add({ path: '/api', router: UsersRouter });
application.add({ path: '/api', router: AuthRouter });
application.add({ path: '/api', router: InstitutionsRouter });

application.start();
