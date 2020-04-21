import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../service/events.service';
import { Observable } from 'rxjs';
import { cache } from '@andes/shared';
import { AuthService } from '../../../login/auth.services';
import { Router } from '@angular/router';
@Component({
    selector: 'events-list',
    templateUrl: './events-list.component.html'
})
export class EventsListComponent implements OnInit {
    events$: Observable<Event[]>;

    constructor(private eventsService: EventsService, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        if (!this.auth.checkPermisos('admin:true')) {
            this.router.navigate(['/']);
        }
        this.events$ = this.eventsService.search().pipe(cache());
    }
}
