import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Event, EventsService } from '../service/events.service';

@Injectable()
export class EventsResolver implements Resolve<Event> {
    constructor(private eventsService: EventsService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Event> {
        return this.eventsService.get(route.params.id);
    }
}
