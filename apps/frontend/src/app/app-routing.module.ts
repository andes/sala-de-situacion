import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppHomeComponent } from './home/home.component';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';

const appRoutes: Routes = [

    { path: 'auth', loadChildren: './login/login.module#LoginModule', canActivate: [RoutingNavBar] },
    {
        path: 'home',
        component: AppHomeComponent,
        canActivate: [RoutingGuard, RoutingNavBar],
        pathMatch: 'full'
    },
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

    { path: '**', redirectTo: '/home' }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
