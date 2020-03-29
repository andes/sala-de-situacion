import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterUserComponent } from './components/user/register-user.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PlexModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent, LogoutComponent, RegisterUserComponent, VerifyEmailComponent],
  providers: []
})
export class LoginModule { }
