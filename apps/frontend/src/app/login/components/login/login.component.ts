import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';

@Component({
    selector: 'app-login',
    templateUrl: 'login.html',
    styleUrls: ['login.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class LoginComponent implements OnInit {
    public usuario: number;
    public password: string;
    public loading = false;

    constructor(private plex: Plex, private auth: Auth) {}

    ngOnInit() {
        this.auth.logout();
    }

    login(event) {
        if (event.formValid) {
            this.loading = true;
            this.auth.login(this.usuario.toString(), this.password).subscribe(
                data => {},
                err => {
                    this.plex.info('danger', 'Usuario o contraseña incorrectos');
                    this.loading = false;
                }
            );
        }
    }
}
