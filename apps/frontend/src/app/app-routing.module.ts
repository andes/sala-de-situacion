import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppHomeComponent } from './home/home.component';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';

const appRoutes: Routes = [

    {
        path: '',
        component: AppHomeComponent,
        canActivate: [RoutingGuard, RoutingNavBar],
        pathMatch: 'full'
    },
    { path: 'auth', loadChildren: './login/login.module#LoginModule', canActivate: [RoutingNavBar] },

    {
        path: 'institution',
        loadChildren: './institutions/institution.module#InstitutionModule',
        canActivate: [RoutingNavBar, RoutingGuard]
    },
    {
        path: 'events',
        loadChildren: './events/events.module#EventsModule',
        canActivate: [RoutingNavBar, RoutingGuard]
    },
    {
        path: 'ocurrence-events',
        loadChildren: './ocurrence-events/ocurrence-events.module#OcurrenceEventsModule',
        canActivate: [RoutingNavBar, RoutingGuard]
    },
    {
        path: 'chart',
        loadChildren: './charts/chart.module#ChartModule',
        canActivate: [RoutingGuard, RoutingNavBar]
    },
    {
        path: 'collaborator',
        loadChildren: './collaborators/collaborator.module#CollaboratorModule',
        canActivate: [RoutingNavBar, RoutingGuard]
    },

    { path: '**', redirectTo: '/' }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
