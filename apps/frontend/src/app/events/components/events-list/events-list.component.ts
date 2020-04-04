import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../service/events.service';
import { Observable } from 'rxjs';
import { cache } from '@andes/shared';
@Component({
    selector: 'events-list',
    templateUrl: './events-list.component.html'
})
export class EventsListComponent implements OnInit {
    events$: Observable<Event[]>;

    constructor(private eventsService: EventsService) {}

    ngOnInit() {
        this.events$ = this.eventsService.search().pipe(cache());
    }
}
