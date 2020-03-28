import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from './auth.services';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: 'login.html',
    styleUrls: ['login.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class LoginComponent implements OnInit {
    public usuario: string;
    public password = '';
    public loading = false;

    constructor(private plex: Plex, private auth: AuthService, private router: Router) {}

    ngOnInit() {
        this.auth.logout();
    }

    login(event) {
        if (event.formValid) {
            this.loading = true;
            this.auth.login(this.usuario.toString(), this.password).subscribe(
                data => {
                    this.router.navigate(['/home']);
                },
                err => {
                    this.plex.info('danger', 'Usuario o contraseña incorrectos');
                    this.loading = false;
                }
            );
        }
    }

    create(event) {
        this.router.navigate(['/create-user']);

        // if (event.formValid) {
        //   this.loading = true;
        //   this.auth.create(this.usuario.toString(), this.password).subscribe(
        //     data => {},
        //     err => {
        //       this.plex.info('danger', 'Usuario o contraseña incorrectos');
        //       this.loading = false;
        //     }
        //   );
        // }
    }
}
