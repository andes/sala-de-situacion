import { Component, OnInit } from '@angular/core';
import { OcurrenceEventsService, OcurrenceEvent } from '../../services/ocurrence-events.service';
import { Observable } from 'rxjs';
import { cache } from '@andes/shared';
import { EventsService } from '../../../events/service/events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import * as moment from 'moment';
@Component({
  selector: 'ocurrence-events-list',
  templateUrl: './ocurrence-events-list.component.html'
})
export class OcurrenceEventsListComponent implements OnInit {
  ocurrenceEvents$: Observable<OcurrenceEvent[]>;
  //filtros
  public fechaDesde;
  public fechaHasta;
  public events = [];
  public institutions = [];
  public selectedInstitution;
  public selectedEvent;
  public filteredOcurrenceEvents: OcurrenceEvent[];

  constructor(private ocurrenceEventsService: OcurrenceEventsService,
    private eventsService: EventsService,
    private institutionService: InstitutionService) { }

  ngOnInit() {
    this.ocurrenceEvents$ = this.ocurrenceEventsService.search().pipe(cache());
    this.institutionService.search({}).subscribe(rtaInstitutions => {
      this.institutions = rtaInstitutions;
    });
    this.eventsService.search({}).subscribe(rtaEvents => {
      this.events = rtaEvents;
      this.selectedEvent = this.events.filter((e) => e.nombre === 'Ocupación')[0];
      this.filtrarResultados();
    });
  }

  filtrarResultados() {
    this.ocurrenceEvents$.subscribe(ocurrenceEvents => {
      this.filteredOcurrenceEvents = ocurrenceEvents;
      if (this.selectedEvent) {
        this.filteredOcurrenceEvents = this.filteredOcurrenceEvents.filter((e) => e.eventKey === this.selectedEvent.categoria);
      }
      if (this.selectedInstitution) {
        this.filteredOcurrenceEvents = this.filteredOcurrenceEvents.filter((e) => e.institucion.id === this.selectedInstitution.id);
      }
      if (this.fechaDesde) {
        this.filteredOcurrenceEvents = this.filteredOcurrenceEvents.filter((e) => e.fecha >= moment(this.fechaDesde).startOf('day').toDate());
      }
      if (this.fechaHasta) {
        this.filteredOcurrenceEvents = this.filteredOcurrenceEvents.filter((e) => e.fecha <= moment(this.fechaHasta).endOf('day').toDate());
      }
    });
  }
}
