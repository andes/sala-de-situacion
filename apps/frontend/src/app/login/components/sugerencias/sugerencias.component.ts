import { AuthService } from './../../services/auth.services';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';
import { Plex } from '@andes/plex';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'modal-sugerencias',
    templateUrl: './sugerencias.html',
    styleUrls: ['../login/login.scss']
})
export class SugerenciasComponent implements OnInit {
    constructor(private plex: Plex, private auth: AuthService, private route: ActivatedRoute, private router: Router) { }

    @ViewChild('modal', { static: true }) modal: PlexModalComponent;

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    @Output() closeModal = new EventEmitter<any>();

    @Input() sugerenciaModel = {
        user: {},
        contenido: '',
        tipo: {}
    };

    tiposSugerencias = [
        { id: 1, nombre: 'Sugerencia' },
        { id: 2, nombre: 'Pregunta' },
        { id: 3, nombre: 'Problema' },
    ];
    public loading = false;
    public token;

    ngOnInit(): void {
        //Busca el token 
        this.route.paramMap.subscribe(token => this.token = token);
        this.auth.getSession().subscribe((sessionUser) => {
            this.sugerenciaModel.user = sessionUser;
        });
    }

    enviar(form) {
        if (form.valid) {
            this.loading = true;
            this.auth.sugerencias(this.sugerenciaModel).subscribe(
                data => {
                    if (data.status === 'ok') {
                        this.plex.toast('success', 'Envío de pregunta/sugerencia', 'Se envió correctamente.');
                    } else {
                        this.plex.info('danger', 'Hubo un problema al enviar la sugerencia, intente de nuevo.');
                    }
                    this.loading = false;
                    this.cancel(form);
                },
                err => {
                    this.plex.info('danger', err);
                    this.loading = false;
                    this.cancel(form);
                }
            );

        }
    }

    cancel(form) {
        form.reset();
        this.sugerenciaModel.tipo = {};
        this.modal.showed = false;
        this.closeModal.emit();
    }
}
