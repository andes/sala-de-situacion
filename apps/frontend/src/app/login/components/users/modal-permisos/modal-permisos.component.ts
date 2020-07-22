import { UserService } from '../../../services/user.services';
import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PlexModalComponent } from '@andes/plex/src/lib/modal/modal.component';
import { IUsuario } from '../../user/IUsuario.interfaces';
import { EventsService } from 'apps/frontend/src/app/events/service/events.service';
import { Plex } from '@andes/plex';

@Component({
    selector: 'modal-permisos',
    templateUrl: 'modal-permisos.html'
})

export class ModalPermisosComponent implements OnInit {
    @ViewChild('modalPermisos', { static: true }) modal: PlexModalComponent;

    @Input()
    set selectedUser(value) {
        if (value) {
            this.user = value;
            this.loadEventosUsuario();
        }
    }

    @Input()
    set show(value) {
        if (value) {
            this.modal.show();
        }
    }

    @Output() closeModal = new EventEmitter<any>();

    public eventos = [];
    public user;
    public eventosUsuario = [];
    public selectedEvent: any = {};

    constructor(
        public plex: Plex,
        public usuarioService: UserService,
        private eventsService: EventsService
    ) { }

    ngOnInit() {
        this.loadEventos();
    }

    ngAfterViewInit() {
        console.log("me abri");
    }

    loadEventos() {
        this.eventsService.search({}).subscribe(resultado => {
            this.eventos = resultado.map(event => {
                return { nombre: event.nombre, id: `${event.categoria}:indicators:write` }
            });
        });
    }

    addEventToUser() {
        const tienePermiso = this.user.permisos.filter(item => item === this.selectedEvent.id).length > 0;
        if (!tienePermiso) {
            this.user.permisos.push(this.selectedEvent.id);
            this.usuarioService.save(this.user).subscribe(() => {
                this.eventosUsuario.push(this.selectedEvent);
                this.selectedEvent = {};
            });
        }
    }

    loadEventosUsuario() {
        this.eventosUsuario = this.eventos.filter(event =>
            this.user.permisos.includes(event.id));
    }

    cerrarPermisos() {
        this.modal.showed = false;
        this.closeModal.emit();
    }

    deleteEventFromUser(permiso) {
        var index = this.user.permisos.indexOf(permiso);
        this.user.permisos.splice(index, 1);
        this.loadEventosUsuario();
    }

}
