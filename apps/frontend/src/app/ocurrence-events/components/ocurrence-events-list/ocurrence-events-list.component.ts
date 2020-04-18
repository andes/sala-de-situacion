import { Component, OnInit } from '@angular/core';
import { OcurrenceEventsService, OcurrenceEvent } from '../../services/ocurrence-events.service';
import { Observable, from } from 'rxjs';
import { cache } from '@andes/shared';
import { EventsService } from '../../../events/service/events.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
@Component({
    selector: 'ocurrence-events-list',
    templateUrl: './ocurrence-events-list.component.html'
})
export class OcurrenceEventsListComponent implements OnInit {
    ocurrenceEvents$: Observable<OcurrenceEvent[]>;
    indicadores = {};
    events = [];
    arrayInstituciones: any[] = [];
    constructor(private ocurrenceEventsService: OcurrenceEventsService, private eventService: EventsService) {}

    ngOnInit() {
        this.ocurrenceEvents$ = this.ocurrenceEventsService.search().pipe(cache());
        this.eventService.search({}).subscribe(rta => {
            this.events = rta.map(r => {
                this.indicadores[r.categoria] = {
                    subfiltros: r.indicadores.filter(v => v.subfiltro).map(x => x.key),
                    evento: r
                };
            });
            this.ocurrenceEvents$.subscribe(events => {
                from(events)
                    .pipe(
                        groupBy(occurrence => occurrence.institucion.id),
                        mergeMap(group => group.pipe(toArray()))
                    )
                    .subscribe(arrayEventos => {
                        this.arrayInstituciones.push(arrayEventos);
                    });
            });
        });
    }
}
