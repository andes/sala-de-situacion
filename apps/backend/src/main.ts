require('dotenv').config();

const { Connections } = require('./app/connection');

const { application } = require('./app/application');

Connections.initialize();

const UsersRouter = require('./app/users/user.controller').UsersRouter;
const AuthRouter = require('./app/auth/auth.routes').AuthRouter;
// const andes = require('./app/routes/andes').router;
// const auth = require('./app/routes/auth').router;

application.add({ path: '/api', router: UsersRouter });
application.add({ path: '/api', router: AuthRouter });
// application.add({ path: '/api/andes', router: andes });
// application.add({ path: '/api/auth', router: auth });

application.start();
