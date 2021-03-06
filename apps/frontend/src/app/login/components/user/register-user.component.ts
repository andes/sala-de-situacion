import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { Utils } from './../../../shared/utils';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';

@Component({
    selector: 'modal-register-user',
    templateUrl: './register-user.html',
    styleUrls: ['../login/login.scss']
})
export class RegisterUserComponent implements OnInit {

    @ViewChild('modal', { static: true }) modal: PlexModalComponent;

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    @Output() closeModal = new EventEmitter<any>();

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
                    this.cancel();
                },
                err => {
                    this.plex.toast('danger', 'Error en los datos ingresador, verifique su email y vuelva a intentarlo.');
                    this.disableEnviar = false;
                    this.cancel();
                }
            );
        } else {
            this.plex.toast('danger', 'Las contraseñas ingresadas no coinciden', 'Error contraseñas');
            this.disableEnviar = false;
        }
    }

    cancel() {
        this.modal.showed = false;
        this.auth.showPassword = false;
        this.closeModal.emit();
    }

    verificarFormatoEmail() {
        let utils = new Utils();
        this.errorEmail = !utils.verificarFormatoEmail(this.usuario.email);
    }

    passwordMatch() {
        return this.usuario.password2 === this.usuario.password;
    }
}
