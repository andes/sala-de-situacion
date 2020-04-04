require('dotenv').config();
const { Connections } = require('./app/connection');
const { application } = require('./app/application');

Connections.initialize();

// Constantes
const UsersRouter = require('./app/users/user.controller').UsersRouter;
const AuthRouter = require('./app/auth/auth.routes').AuthRouter;
const InstitutionsRouter = require('./app/institution/institution.controller').InstitutionRouter;
const EventsRouter = require('./app/events/event.controller').EventsRouter;
const OcurrenceEventRoutes = require('./app/ocurrence-events/ocurrence-events.controller').OcurrenceEventRoutes;
const ProvinciaRouter = require('./app/location/provincia.controller').ProvinciaRouter;
const LocalidadRouter = require('./app/location/localidad.controller').LocalidadRouter;
const BarrioRouter = require('./app/location/barrio.controller').BarrioRouter;

// Rutas
application.add({ path: '/api', router: UsersRouter });
application.add({ path: '/api', router: AuthRouter });
application.add({ path: '/api', router: InstitutionsRouter });
application.add({ path: '/api', router: EventsRouter });
application.add({ path: '/api', router: OcurrenceEventRoutes });
application.add({ path: '/api', router: ProvinciaRouter });
application.add({ path: '/api', router: LocalidadRouter });
application.add({ path: '/api', router: BarrioRouter });

application.start();
