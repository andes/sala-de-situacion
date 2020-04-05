import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard, RoutingNavBar } from './routing-guard';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterUserComponent } from './components/user/register-user.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ActivacionCuentaComponent } from './components/activacion-cuenta/activacion-cuenta.component';

const routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent, canActivate: [RoutingNavBar, RoutingGuard] },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'verify-email/:email', component: VerifyEmailComponent },
    { path: 'activacion-cuenta/:token', component: ActivacionCuentaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class LoginRoutingModule { }
