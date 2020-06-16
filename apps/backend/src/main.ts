require('dotenv').config();
const { Connections } = require('./app/connection');
const { application } = require('./app/application');
Connections.initialize();

// Constantes
const UsersRouter = require('./app/users/user.controller').UsersRouter;
const DisclaimersRouter = require('./app/disclaimers/disclaimer.controller').DisclaimersRouter;
const AuthRouter = require('./app/auth/auth.routes').AuthRouter;
const InstitutionsRouter = require('./app/institution/institution.controller').InstitutionRouter;
const EventsRouter = require('./app/events/event.controller').EventsRouter;
const OcurrenceEventRoutes = require('./app/ocurrence-events/ocurrence-events.controller').OcurrenceEventRoutes;
const OcurrenceEventHistoryRoutes = require('./app/ocurrence-events-history/ocurrence-events-history.controller')
    .OcurrenceEventHistoryRoutes;
const ProvinciaRouter = require('./app/location/provincia.controller').ProvinciaRouter;
const LocalidadRouter = require('./app/location/localidad.controller').LocalidadRouter;
const BarrioRouter = require('./app/location/barrio.controller').BarrioRouter;
const GeoreferenciasRouter = require('./app/georeferencia/georeferencia.routes').GeoreferenciaRouter;
const ChartsRouter = require('./app/charts/charts.controller').ChartsRouter;
const CollaboratorsRouter = require('./app/collaborators/collaborator.controller').CollaboratorRouter;
const ServiciosRouter = require('./app/servicios/servicios.routes').ServiciosRouter;
const CheckoutsRouter = require('./app/hospitalizations/checkout.controller').CheckoutsRouter;
const OcupationsRouter = require('./app/hospitalizations/ocupation.controller').OcupationsRouter;


// Rutas
application.add({ path: '/api', router: UsersRouter });
application.add({ path: '/api', router: DisclaimersRouter });
application.add({ path: '/api', router: AuthRouter });
application.add({ path: '/api', router: InstitutionsRouter });
application.add({ path: '/api', router: EventsRouter });
application.add({ path: '/api', router: OcurrenceEventRoutes });
application.add({ path: '/api', router: OcurrenceEventHistoryRoutes });
application.add({ path: '/api', router: ProvinciaRouter });
application.add({ path: '/api', router: LocalidadRouter });
application.add({ path: '/api', router: BarrioRouter });
application.add({ path: '/api', router: GeoreferenciasRouter });
application.add({ path: '/api', router: ChartsRouter });
application.add({ path: '/api', router: CollaboratorsRouter });
application.add({ path: '/api', router: ServiciosRouter });
application.add({ path: '/api', router: CheckoutsRouter });
application.add({ path: '/api', router: OcupationsRouter });

application.start();
