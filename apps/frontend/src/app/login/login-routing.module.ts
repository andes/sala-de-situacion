import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutingGuard } from './routing-guard';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { CreateUserComponent } from './components/create/create-user.component';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [RoutingGuard] },
  {
    path: 'create-user',
    component: CreateUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: []
})
export class LoginRoutingModule {}
