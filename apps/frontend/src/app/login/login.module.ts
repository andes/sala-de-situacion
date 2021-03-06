import { SugerenciasComponent } from './components/sugerencias/sugerencias.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RegisterUserComponent } from './components/user/register-user.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

import { LoginRoutingModule } from './login-routing.module';
import { ActivacionCuentaComponent } from './components/activacion-cuenta/activacion-cuenta.component';
import { RegeneratePasswordComponent } from './components/regenerate-password/regenerate-password';
import { UserProfileComponent } from './components/perfil/user-profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, PlexModule, LoginRoutingModule],
    declarations: [
        LoginComponent,
        LogoutComponent,
        ResetPasswordComponent,
        RegisterUserComponent,
        RegeneratePasswordComponent,
        VerifyEmailComponent,
        ActivacionCuentaComponent,
        UserProfileComponent,
        SugerenciasComponent
    ],
    providers: []
})
export class LoginModule { }
