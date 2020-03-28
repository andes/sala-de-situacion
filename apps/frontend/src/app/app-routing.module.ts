import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppHomeComponent } from './home/home.component';
import { RoutingGuard, RoutingNavBar } from './login/routing-guard';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: AppHomeComponent, canActivate: [RoutingNavBar, RoutingGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
