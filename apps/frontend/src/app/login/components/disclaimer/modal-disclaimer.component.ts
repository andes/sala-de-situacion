import { UserService } from './../../services/user.services';
import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';
import { DisclaimerService } from '../../services/disclaimer.services';
import { AuthService } from '../../services/auth.services';
import * as moment from 'moment';

@Component({
    selector: 'modal-disclaimer',
    templateUrl: 'modal-disclaimer.html',
})

export class ModalDisclaimerComponent implements OnInit {
    @ViewChild('modal', { static: true }) modal: PlexModalComponent;

    public disclaimer: any = null;
    public version: String = null;
    public texto: String = null;

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    constructor(
        private auth: AuthService,
        private router: Router,
        public disclaimerService: DisclaimerService,
        public userService: UserService
    ) { }

    ngOnInit() {
        this.disclaimerService.search({ activo: true }).subscribe(data => {
            if (data) {
                this.disclaimer = data[0];
                this.version = this.disclaimer.version;
                this.texto = this.disclaimer.texto;
            }
        });
    }

    cancelar() {
        this.router.navigate(['/']);
    }

    aceptarDisclaimer() {
        this.userService.get(this.auth.user_id).subscribe(rta => {
            let user = rta;
            if (!user.disclaimers) {
                user.disclaimers = [];
            }
            const objectDisclaimer = {
                _id: this.disclaimer.id,
                createdAt: moment().toDate()
            };
            user.disclaimers.push(objectDisclaimer);
            this.userService.save(user).subscribe(() => {
                this.modal.close();
            });
        });
    }
}
