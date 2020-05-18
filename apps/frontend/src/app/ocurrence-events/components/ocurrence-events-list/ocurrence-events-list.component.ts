import { Component, OnInit } from '@angular/core';
import { OcurrenceEventsService, OcurrenceEvent } from '../../services/ocurrence-events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Observable, from } from 'rxjs';
import { cache } from '@andes/shared';
import { EventsService } from '../../../events/service/events.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from '../../../login/services/auth.services';
import { DisclaimerService } from '../../../login/services/disclaimer.services';
import { UserService } from '../../../login/services/user.services';

@Component({
    selector: 'ocurrence-events-list',
    templateUrl: './ocurrence-events-list.component.html'
})
export class OcurrenceEventsListComponent implements OnInit {
    ocurrenceEvents$: Observable<OcurrenceEvent[]>;
    indicadores = {};
    events = [];
    arrayInstituciones = [];
    arrayPorEvento = [];
    // Filtros
    public fechaDesde;
    public fechaHasta;
    public institutions = [];
    public labelsIndicadores = [];
    public subfiltros = [];
    public eventos = [];
    public eventosLabels = [];
    public showModalDisclaimer = false;
    public selectedInstitution;
    public selectedSubfiltros = [];
    public selectedEvent;

    constructor(
        private ocurrenceEventsService: OcurrenceEventsService,
        private eventService: EventsService,
        private institutionService: InstitutionService,
        private auth: AuthService,
        public disclaimerService: DisclaimerService,
        public userService: UserService
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
            this.eventos.map(x => (this.eventosLabels[x.categoria] = { label: x.nombre }));
            this.events = rta.map(r => {
                this.indicadores[r.categoria] = {
                    subfiltros: r.indicadores.filter(v => v.subfiltro).map(x => x.key),
                    evento: r
                };
                r.indicadores.map(x => (this.labelsIndicadores[x.key] = { label: x.label }));
            });
            this.filtrarResultados();
        });

        this.consultarDisclaimers();
    }

    private consultarDisclaimers() {
        this.disclaimerService.search({ activo: true }).subscribe(disclaimers => {
            if (disclaimers && disclaimers.length > 0) {
                let disclaimer = disclaimers[0];
                this.userService.get(this.auth.user_id).subscribe(rta => {
                    const user = rta;
                    if (!user.disclaimers.some(item => item.id === disclaimer.id)) {
                        this.showModalDisclaimer = true;
                    }
                });
            }
        });
    }

    filtrarResultados() {
        this.arrayInstituciones = [];
        this.arrayPorEvento = [];
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
                this.subfiltros = [];
                this.selectedEvent.indicadores
                    .filter(e => e.subfiltro)
                    .map(r => {
                        this.subfiltros.push({
                            key: r.key,
                            values: ocurrenceEvents
                                .filter(e => e.indicadores[r.key])
                                .map(x => ({ id: x.indicadores[r.key], nombre: x.indicadores[r.key] }))
                        });
                    });
                this.indicadores[this.selectedEvent.categoria].subfiltros.forEach(subfiltro => {
                    if (this.selectedSubfiltros[subfiltro]) {
                        let value = this.selectedSubfiltros[subfiltro];
                        ocurrenceEvents = ocurrenceEvents.filter(e => e.indicadores[subfiltro] === value.nombre);
                    }
                });
            } else {
                this.subfiltros = [];
                this.selectedSubfiltros = [];
            }
            from(ocurrenceEvents)
                .pipe(
                    groupBy(occurrence => occurrence.institucion.id),
                    mergeMap(group => group.pipe(toArray()))
                )
                .subscribe(ocurrences => {
                    this.arrayPorEvento = [];
                    from(ocurrences)
                        .pipe(
                            groupBy(occurrence => occurrence.eventKey),
                            mergeMap(group => group.pipe(toArray()))
                        )
                        .subscribe(ev => {
                            this.arrayPorEvento.push(ev);
                        });
                    this.arrayInstituciones.push(this.arrayPorEvento);
                });
        });
    }
}
