import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../../events/service/events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Unsubscribe } from '@andes/shared';
import { OcurrenceEvent, OcurrenceEventsService } from '../../services/ocurrence-events.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SelectSearchService } from '../../../shared/select-search.service';

@Component({
    selector: 'occurrence-events-crud',
    templateUrl: './ocurrence-events-crud.component.html'
})
export class OccurrenceEventsCrudComponent implements OnInit {
    public institutionSelected: any;
    public institutions = [];
    public eventos = [];
    public eventSelected: Event;
    public tiposList;
    public eventDate: Date;
    public indicadores = {};
    public ocurrenceEvent: OcurrenceEvent;
    public show: boolean = false;

    constructor(
        private ocurrenceEventsService: OcurrenceEventsService,
        private eventsService: EventsService,
        private institutionService: InstitutionService,
        private plex: Plex,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.institutionService.search({}).subscribe(rta => {
            this.institutions = rta;
            if (rta.length === 1) {
                this.institutionSelected = rta[0];
            }
        });
        this.eventsService.search({}).subscribe(rta => {
            this.eventos = rta;
        });

        const ocurrenceEvent: OcurrenceEvent = this.route.snapshot.data.ocurrenceEvent;
        if (ocurrenceEvent) {
            this.show = true;
            this.ocurrenceEvent = ocurrenceEvent;
            this.institutionSelected = ocurrenceEvent.institucion;
            this.eventDate = new Date();
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
