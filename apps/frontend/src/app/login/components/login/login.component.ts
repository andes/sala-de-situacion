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

    public loading = false;
    public showModalResetPassword = false;
    public showModalRegisterUser = false;

    constructor(private plex: Plex, public auth: AuthService, private router: Router) { }

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

    // create() {
    //     this.router.navigate(['auth/register-user']);
    // }

    close(event) {
        this.showModalResetPassword = false;
    }

    forgot() {
        this.showModalResetPassword = true;
    }

    register() {
        this.showModalRegisterUser = true;
    }
}
