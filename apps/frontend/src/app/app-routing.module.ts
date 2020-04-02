import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppHomeComponent } from './home/home.component';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';

const appRoutes: Routes = [
    {
        path: '',
        component: AppHomeComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
        pathMatch: 'full'
    },
    { path: 'auth', loadChildren: './login/login.module#LoginModule', canActivate: [RoutingNavBar] },
    {
        path: 'institution',
        loadChildren: './institution/institution.module#InstitutionModule',
        canActivate: [RoutingNavBar, RoutingGuard]
    },

    { path: '**', redirectTo: '/' }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
