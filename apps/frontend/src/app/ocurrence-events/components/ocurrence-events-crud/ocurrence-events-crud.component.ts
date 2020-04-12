import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../../events/service/events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Unsubscribe } from '@andes/shared';
import { OcurrenceEvent, OcurrenceEventsService } from '../../services/ocurrence-events.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'occurrence-events-crud',
    templateUrl: './ocurrence-events-crud.component.html'
})
export class OccurrenceEventsCrudComponent implements OnInit {
    public institutionSelected: any;
    public institutions = [];
    public eventSelected: Event;
    public tiposList;
    public eventDate: Date;
    public indicadores = {};
    public ocurrenceEvent: OcurrenceEvent;

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
        const ocurrenceEvent: OcurrenceEvent = this.route.snapshot.data.ocurrenceEvent;
        if (ocurrenceEvent) {
            this.ocurrenceEvent = ocurrenceEvent;
            this.institutionSelected = ocurrenceEvent.institucion;
            this.eventDate = ocurrenceEvent.fecha;
            this.eventsService.search({ categoria: ocurrenceEvent.eventKey }).subscribe(evento => {
                this.eventSelected = evento[0];
            });
            this.indicadores = ocurrenceEvent.indicadores;
        }
    }

    @Unsubscribe()
    onEventSearch($event) {
        if ($event.query) {
            return this.eventsService.search({ search: '^' + $event.query }).subscribe($event.callback);
        } else {
            $event.callback([]);
        }
    }

    onSave($event) {
        if (!$event.formValid) {
            return;
        }
        const indicadores = {};
        for (const key in this.indicadores) {
            indicadores[key] = this.indicadores[key];
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
