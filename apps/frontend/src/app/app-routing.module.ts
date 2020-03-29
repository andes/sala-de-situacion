import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppHomeComponent } from './home/home.component';
import { RoutingNavBar } from './login/routing-guard';
import { AppInstitutionComponent } from './institution/institution.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'home',
        component: AppHomeComponent,
        canActivate: [RoutingNavBar]
    },
    {
        path: 'institution',
        component: AppInstitutionComponent,
        canActivate: [RoutingNavBar]
    },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },

    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
