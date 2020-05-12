import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../../events/service/events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { OcurrenceEvent, OcurrenceEventsService } from '../../services/ocurrence-events.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../login/services/auth.services';

@Component({
    selector: 'occurrence-events-crud',
    templateUrl: './ocurrence-events-crud.component.html'
})
export class OccurrenceEventsCrudComponent implements OnInit {
    public institutionSelected: any;
    public institutions = [];
    public eventSelected: Event;
    public loadedEvents = [];
    public events = [];
    public tiposList;
    public eventDate: Date;
    public minDate: Date;
    public indicadores = {};
    public ocurrenceEvent: OcurrenceEvent;
    public show: boolean = false;

    constructor(
        private ocurrenceEventsService: OcurrenceEventsService,
        private eventsService: EventsService,
        private institutionService: InstitutionService,
        private plex: Plex,
        private location: Location,
        private route: ActivatedRoute,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.eventsService.search({}).subscribe(rta => {
            this.loadedEvents = rta;
            this.events = this.loadedEvents;
        });
        this.institutionService.search({}).subscribe(rta => {
            this.institutions = rta;
            if (rta.length === 1) {
                this.institutionSelected = rta[0];
                this.loadEventos();
            }
        });
        const ocurrenceEvent: OcurrenceEvent = this.route.snapshot.data.ocurrenceEvent;
        this.eventDate = new Date();
        if (ocurrenceEvent) {
            this.show = true;
            this.ocurrenceEvent = ocurrenceEvent;
            this.institutionSelected = ocurrenceEvent.institucion;
            this.minDate = ocurrenceEvent.fecha;
            this.eventsService.search({ categoria: ocurrenceEvent.eventKey }).subscribe(evento => {
                this.eventSelected = evento[0];
            });
            this.indicadores = ocurrenceEvent.indicadores;
            for (const key in this.indicadores) {
                if (key.startsWith('id_')) {
                    this.indicadores[key.substring(3)] = {
                        id: this.indicadores[key],
                        nombre: this.indicadores[key.substring(3)]
                    };
                }
            }
        }
    }

    updateMinDate() {
        this.minDate = null;
        if (this.institutionSelected) {
            if (this.eventSelected) {
                this.ocurrenceEventsService
                    .search({ instituciones: [this.institutionSelected.id], eventKey: this.eventSelected.categoria })
                    .subscribe(rta => {
                        let ordenados = rta.sort((a: any, b: any) => {
                            return Date.parse(b.fecha) - Date.parse(a.fecha);
                        });
                        if (ordenados[0]) {
                            this.minDate = ordenados[0].fecha;
                        } else {
                            this.minDate = null;
                        }
                    });
            }
        }
    }

    loadEventos() {
        if (!this.auth.checkPermisos('admin:true') && this.institutionSelected) {
            let eventosInstitucion = this.institutionSelected.events.map(event => event.id);
            this.events = this.loadedEvents.filter(event => eventosInstitucion.includes(event.id));
            this.eventSelected = null;
        }
    }

    onSave($event) {
        if (!$event.formValid) {
            return;
        }
        const indicadores = {};
        for (const key in this.indicadores) {
            const indicador = this.eventSelected.indicadores.find(indicador => indicador.key === key);
            if (indicador && indicador.type === 'select') {
                indicadores[`id_${key}`] = this.indicadores[key].id;
                indicadores[key] = this.indicadores[key].nombre;
            } else {
                indicadores[key] = this.indicadores[key];
            }
        }

        const event: OcurrenceEvent = {
            id: this.ocurrenceEvent ? this.ocurrenceEvent.id : null,
            institucion: {
                id: this.institutionSelected.id,
                nombre: this.institutionSelected.nombre
            },
            eventKey: this.eventSelected.categoria,
            fecha: this.eventDate,
            indicadores,
            activo: true
        };

        this.ocurrenceEventsService.save(event).subscribe(() => {
            this.plex.toast('success', 'Indicadores registrados con exito! ');
            this.location.back();
        });
    }
}
