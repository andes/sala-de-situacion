import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: 'login.html',
    styleUrls: ['login.scss'],
})
export class LoginComponent implements OnInit {
    public usuario: string;
    public password = '';
    public showPassword = true;
    public passwordTooltip: 'mostrar contraseña' | 'ocultar contraseña' = 'mostrar contraseña';
    public loading = false;
    public eye: 'eye' | 'eye-off' = 'eye'; // mostrar/ocultar password

    constructor(private plex: Plex, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.auth.logout();
    }

    login(event) {
        if (event.formValid) {
            this.loading = true;
            this.auth.login(this.usuario.toString(), this.password).subscribe(
                data => {
                    this.router.navigate(['/']);
                },
                err => {
                    this.plex.info('danger', 'Usuario o contraseña incorrectos');
                    this.loading = false;
                }
            );
        }
    }

    create() {
        this.router.navigate(['auth/register-user']);
    }

    toggleEye() {
        this.showPassword = !this.showPassword;
        if (this.showPassword) {
            this.eye = 'eye';
            this.passwordTooltip = 'mostrar contraseña';
        } else {
            this.eye = 'eye-off';
            this.passwordTooltip = 'ocultar contraseña';
        }
    }
    forgot() {
        this.router.navigate(['auth/reset-password']);
    }
}
