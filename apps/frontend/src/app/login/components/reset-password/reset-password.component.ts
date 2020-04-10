import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
@Component({
    selector: 'reset-password',
    templateUrl: 'reset-password.html',
    styleUrls: ['reset-password.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class ResetPasswordComponent implements OnInit {
    public loading = false;
    public email = '';
    constructor(private plex: Plex, private auth: AuthService, private router: Router) { }

    ngOnInit() { }

    reset(event) {
        if (event.formValid) {
            this.loading = true;
            this.auth.setNewValidationToken(this.email).subscribe(
                data => {
                    if (data.status === 'ok') {
                        this.plex.info('success', 'Hemos enviado un mail para regenerar su contraseña');
                        this.loading = false;
                        this.router.navigate(['/']);
                    } else {
                        this.plex.info('danger', 'El mail ingresado no existe');
                        this.loading = false;
                    }
                },
                err => {
                    this.plex.info('danger', err);
                    this.loading = false;
                }
            );
        }
    }

    cancel() {
        this.router.navigate(['/']);
    }
}
