import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
import { Utils } from './../../../shared/utils';

@Component({
    selector: 'register-user',
    templateUrl: './register-user.html',
    styleUrls: ['../login/login.scss']
})
export class RegisterUserComponent implements OnInit {
    public email = '';
    public disableEnviar = false;
    public password2 = null;
    usuario = {
        documento: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        password2: null,
    };

    public errorEmail = false;

    constructor(public plex: Plex, public auth: AuthService, private router: Router) { }
    size: any;

    ngOnInit() { }
    enviar() {
        this.disableEnviar = true;
        if (this.passwordMatch()) {
            this.auth.create(this.usuario).subscribe(
                data => {
                    this.router.navigate(['auth/verify-email/' + this.usuario.email]);
                },
                err => {
                    this.plex.toast('danger', 'Error en los datos ingresador, verifique su email y vuelva a intentarlo.');
                    this.disableEnviar = false;
                }
            );
        } else {
            this.plex.toast('danger', 'Las contraseñas ingresadas no coinciden', 'Error contraseñas');
            this.disableEnviar = false;
        }
    }
    cancelar() {
        this.router.navigate(['auth', 'login']);
    }

    verificarFormatoEmail() {
        let utils = new Utils();
        this.errorEmail = !utils.verificarFormatoEmail(this.usuario.email);
    }

    passwordMatch() {
        return this.usuario.password2 === this.usuario.password;
    }
    getSize(e) {
        this.size = e.value;
        return this.size;
    }
    getresponsiveSize() {
        return this.size;
    }
}
