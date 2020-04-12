import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';
@Component({
    selector: 'modal-reset-password',
    templateUrl: 'reset-password.html',
    styleUrls: ['reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {

    @ViewChild('modal', { static: true }) modal: PlexModalComponent;

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    @Output() closeModal = new EventEmitter<any>();

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
                        this.plex.info('success', 'Hemos enviado un e-mail para regenerar su contraseña');
                        this.loading = false;
                    } else {
                        this.plex.info('danger', 'El e-mail ingresado no está registrado');
                        this.loading = false;
                    }
                    this.cancel();
                },
                err => {
                    this.plex.info('danger', err);
                    this.loading = false;
                    this.cancel();
                }
            );
        }
    }

    cancel() {
        this.modal.showed = false;
        this.closeModal.emit();
    }

}
