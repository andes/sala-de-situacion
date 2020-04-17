import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
import { IUsuario } from './IUsuario.interfaces';

@Component({
    selector: 'register-user',
    templateUrl: './register-user.html',
    styleUrls: ['../login/login.scss']
})
export class RegisterUserComponent implements OnInit {
    public email = '';
    public disableEnviar = false;
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

    constructor(public plex: Plex, private auth: AuthService, private router: Router) { }
    size: any;

    ngOnInit() { }
    enviar() {
        this.disableEnviar = true;
        this.auth.create(this.usuario).subscribe(
            data => {
                this.router.navigate(['auth/verify-email/' + this.usuario.email]);
            },
            err => { }
        );
        if (this.passwordMatch()) {
            this.auth.create(this.usuario).subscribe(
                data => {
                    this.router.navigate(['auth/verify-email/' + this.usuario.email]);
                },
                err => { }
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
        let formato = /^[a-zA-Z0-9_.+-]+\@[a-zA-Z0-9-]+(\.[a-z]{2,4})+$/;
        let email = this.usuario.email;
        if (email) {
            if (formato.test(email)) {
                this.errorEmail = false;
            } else {
                this.errorEmail = true;
            }
        } else {
            this.errorEmail = false;
        }
    };
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