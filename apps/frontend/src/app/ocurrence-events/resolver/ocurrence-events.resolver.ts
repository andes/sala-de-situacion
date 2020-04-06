import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OcurrenceEvent, OcurrenceEventsService } from '../services/ocurrence-events.service';

@Injectable()
export class OcurrenceEventsResolver implements Resolve<OcurrenceEvent> {
    constructor(private ocurrenceEventsService: OcurrenceEventsService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<OcurrenceEvent> {
        return this.ocurrenceEventsService.get(route.params.id);
    }
}
