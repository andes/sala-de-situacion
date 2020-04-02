import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppHomeComponent } from './home/home.component';
import { RoutingNavBar } from './login/routing-guard';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'home',
        component: AppHomeComponent,
        canActivate: [RoutingNavBar]
    },
    { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [RoutingNavBar] },
    {
        path: 'institution',
        loadChildren: './institution/institution.module#InstitutionModule',
        canActivate: [RoutingNavBar]
    },

    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
