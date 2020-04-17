import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OcurrenceEventHistory, OcurrenceEventsHistoryService } from '../services/ocurrence-events-history.service';

@Injectable()
export class OcurrenceEventsHistoryResolver implements Resolve<OcurrenceEventHistory> {
    constructor(private ocurrenceEventsHistoryService: OcurrenceEventsHistoryService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<OcurrenceEventHistory> {
        return this.ocurrenceEventsHistoryService.get(route.params.id);
    }
}
