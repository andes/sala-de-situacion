import { Component, OnInit } from '@angular/core';
import { OcurrenceEventsService, OcurrenceEvent } from '../../services/ocurrence-events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Observable, from } from 'rxjs';
import { cache } from '@andes/shared';
import { EventsService } from '../../../events/service/events.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'ocurrence-events-list',
    templateUrl: './ocurrence-events-list.component.html'
})
export class OcurrenceEventsListComponent implements OnInit {
    ocurrenceEvents$: Observable<OcurrenceEvent[]>;
    indicadores = {};
    events = [];
    arrayInstituciones = [];
    // Filtros
    public fechaDesde;
    public fechaHasta;
    public institutions = [];
    public eventos = [];
    public selectedInstitution;
    public selectedEvent;

    constructor(
        private ocurrenceEventsService: OcurrenceEventsService,
        private eventService: EventsService,
        private institutionService: InstitutionService
    ) { }

    ngOnInit() {
        this.ocurrenceEvents$ = this.ocurrenceEventsService.search().pipe(cache());
        this.institutionService.search({}).subscribe(rtaInstitutions => {
            this.institutions = rtaInstitutions;
            if (this.institutions && this.institutions.length === 1) {
                this.selectedInstitution = this.institutions[0];
            }
        });
        this.eventService.search({}).subscribe(rta => {
            this.eventos = rta;
            this.events = rta.map(r => {
                this.indicadores[r.categoria] = {
                    subfiltros: r.indicadores.filter(v => v.subfiltro).map(x => x.key),
                    evento: r
                };
            });
            this.filtrarResultados();
        });
    }

    filtrarResultados() {
        this.arrayInstituciones = [];
        this.ocurrenceEvents$.subscribe(ocurrenceEvents => {
            if (this.fechaDesde) {
                ocurrenceEvents = ocurrenceEvents.filter(
                    e =>
                        e.fecha >=
                        moment(this.fechaDesde)
                            .startOf('day')
                            .toDate()
                );
            }
            if (this.fechaHasta) {
                ocurrenceEvents = ocurrenceEvents.filter(
                    e =>
                        e.fecha <=
                        moment(this.fechaHasta)
                            .endOf('day')
                            .toDate()
                );
            }
            if (this.selectedInstitution) {
                ocurrenceEvents = ocurrenceEvents.filter(e => e.institucion.id === this.selectedInstitution.id);
            }
            if (this.selectedEvent) {
                ocurrenceEvents = ocurrenceEvents.filter(e => e.eventKey === this.selectedEvent.categoria);
            }
            from(ocurrenceEvents)
                .pipe(
                    groupBy(occurrence => occurrence.institucion.id),
                    mergeMap(group => group.pipe(toArray()))
                )
                .subscribe(arrayEventos => {
                    this.arrayInstituciones.push(arrayEventos);
                });
        });
    }
}
