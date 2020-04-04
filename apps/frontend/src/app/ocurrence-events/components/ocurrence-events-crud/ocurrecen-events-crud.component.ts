import { Component } from '@angular/core';
import { EventsService, Event } from '../../../events/service/events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Unsubscribe } from '@andes/shared';
import { OcurrenceEvent, OcurrenceEventsService } from '../../services/ocurrence-event.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';

@Component({
    selector: 'occurrence-events-crud',
    templateUrl: './ocurrecen-events-crud.component.html'
})
export class OccurrenceEventsCrudComponent {
    public institutionSelected: any;
    public eventSelected: Event;
    public eventDate: Date;
    public indicadores = {};

    constructor(
        private ocurrenceEventsService: OcurrenceEventsService,
        private eventsService: EventsService,
        private institutionService: InstitutionService,
        private plex: Plex,
        private location: Location
    ) {}

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
