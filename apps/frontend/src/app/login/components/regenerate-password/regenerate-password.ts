import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
import { IUsuario } from '../user/IUsuario.interfaces';
import { Observable } from 'rxjs';

@Component({
    selector: 'regenerate-password',
    templateUrl: 'regenerate-password.html',
    styleUrls: ['regenerate-password.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class RegeneratePasswordComponent implements OnInit {
    public loading = false;
    public password1 = '';
    public password2 = '';
    public user$: Observable<IUsuario>;
    public token;

    constructor(private plex: Plex, private route: ActivatedRoute, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        //Busca el token y activa la cuenta
        this.route.paramMap.subscribe(params => {
            this.token = params.get('token')
        })
    }

    save(event) {
        if (event.formValid) {
            if (this.password1 === this.password2) {
                this.loading = true;
                this.auth.resetPassword({ token: this.token, password: this.password1 }).subscribe(
                    data => {
                        this.plex.info('success', 'La contraseña ha sido restablecida correctamente');
                        this.loading = false;
                        this.router.navigate(['/auth/login']);
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

}
