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
        const ocurrenceEvent: OcurrenceEvent = this.route.snapshot.data.ocurrenceEvent;
        if (ocurrenceEvent) {
            this.ocurrenceEvent = ocurrenceEvent;
            console.log('ocurrenceEvents ', this.ocurrenceEvent);
            this.institutionSelected = ocurrenceEvent.institucion;
            this.eventDate = ocurrenceEvent.fecha;
            this.eventsService.search({ categoria: ocurrenceEvent.eventKey }).subscribe(evento => {
                // debugger;
                this.eventSelected = evento[0];
                this.indicadores = this.ocurrenceEvent.indicadores;
                console.log(this.eventSelected);
            });
            // this.ocurrenceEvent.indicadores.forEach(indicador => {
            //     this.eventSelected['type'] = this.tiposList.find(t => t.id === indicador.type) as any;
            // });
        }
    }

    @Unsubscribe()
    onInstitutionSearch($event) {
        if ($event.query) {
            return this.institutionService
                .search({ search: '^' + $event.query, fields: 'nombre' })
                .subscribe($event.callback);
        } else {
            $event.callback([]);
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
        const indicadores = [];
        for (const key in this.indicadores) {
            indicadores.push({ key, valor: this.indicadores[key] });
        }
        const occurrenceEvent: OcurrenceEvent = {
            institucion: {
                id: this.institutionSelected.id,
                nombre: this.institutionSelected.nombre
            },
            eventKey: this.eventSelected.categoria,
            fecha: this.eventDate,
            indicadores,
            activo: true
        };
        this.ocurrenceEventsService.save(occurrenceEvent).subscribe(() => {
            this.plex.toast('success', 'Indicadores registrados con exito! ');
            this.location.back();
        });
    }
}
