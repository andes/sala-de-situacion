import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { IUsuario } from '../user/IUsuario.interfaces';
import { Observable } from 'rxjs';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';

@Component({
    selector: 'modal-regenerate-password',
    templateUrl: 'regenerate-password.html',
    styleUrls: ['regenerate-password.scss'],
})
export class RegeneratePasswordComponent implements OnInit {

    @ViewChild('modal', { static: true }) modal: PlexModalComponent;

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    @Output() closeModal = new EventEmitter<any>();

    public loading = false;
    public password1 = '';
    public password2 = '';
    public user$: Observable<IUsuario>;
    public token;

    constructor(private plex: Plex, private route: ActivatedRoute, public auth: AuthService, private router: Router) { }

    ngOnInit() {
        //Busca el token y activa la cuenta
        this.route.paramMap.subscribe(params => {
            this.token = params.get('token');
            if (this.token) {
                this.modal.show();
            }
        });
    }

    save(event) {
        if (event.formValid) {
            if (this.password1 === this.password2) {
                this.loading = true;
                this.auth.resetPassword({ token: this.token, password: this.password1 }).subscribe(
                    data => {
                        this.plex.info('success', 'La contraseña ha sido restablecida correctamente');
                        this.loading = false;
                    },
                    err => {
                        this.plex.info('danger', err);
                        this.loading = false;
                    }
                );
            } else {
                this.plex.info('danger', 'Las contraseñas no coinciden', 'Error contraseñas');
            }

        }
    }

    cancel() {
        this.modal.showed = false;
        this.auth.showPassword = false;
        this.closeModal.emit();
        if (this.token) {
            this.router.navigate(['/auth/login']);
        }
    }

}
