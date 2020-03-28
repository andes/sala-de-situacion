import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from './routing-guard';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

const routes = [
    { path: 'logout', component: LogoutComponent, canActivate: [RoutingGuard] },
    { path: '', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class LoginRoutingModule {}
