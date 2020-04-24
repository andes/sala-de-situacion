import { IUsuario } from './../user/IUsuario.interfaces';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';
import { Plex } from '@andes/plex';

@Component({
    selector: 'modal-sugerencias',
    templateUrl: './sugerencias.html',
    styleUrls: ['../login/login.scss']
})
export class SugerenciasComponent implements OnInit {
    constructor(private plex: Plex) { }

    @ViewChild('modal', { static: true }) modal: PlexModalComponent;

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    @Output() closeModal = new EventEmitter<any>();

    @Input() sugerenciaModel = {
        usuario: {},
        contenido: '',
        tipo: {}
    };

    tiposSugerencias = [
        { id: 1, nombre: 'sugerencia' },
        { id: 2, nombre: 'pregunta' },
        { id: 3, nombre: 'problema' },
    ];

    ngOnInit(): void { }

    enviar(e) {
        if (e) {
            this.plex.toast('success', 'Envío de pregunta/sugerencia', 'Se envió correctamente.')
        }
    }

    cancel() {
        this.modal.showed = false;
        this.closeModal.emit();
    }
}
