require('dotenv').config();
const { Connections } = require('./app/connection');
const { application } = require('./app/application');

Connections.initialize();

// Constantes
const UsersRouter = require('./app/users/user.controller').UsersRouter;
const AuthRouter = require('./app/auth/auth.routes').AuthRouter;
const InstitutionsRouter = require('./app/institution/institution.controller').InstitutionRouter;
const EventsRouter = require('./app/events/event.controller').EventsRouter;
<<<<<<< HEAD
=======
const MailRouter = require('./app/services/mail/mail.routes').MailRouter;
const EventTypesRoutes = require('./app/event-types/event-types.controller').EventTypesRoutes;
>>>>>>> 14412fc... feat(backend): schema tipo eventos

// Rutas
application.add({ path: '/api', router: UsersRouter });
application.add({ path: '/api', router: AuthRouter });
application.add({ path: '/api', router: InstitutionsRouter });
application.add({ path: '/api', router: EventsRouter });
<<<<<<< HEAD
=======
application.add({ path: '/api/mail', router: MailRouter });
application.add({ path: '/api', router: EventTypesRoutes });
>>>>>>> 14412fc... feat(backend): schema tipo eventos

application.start();
