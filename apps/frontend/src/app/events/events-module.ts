import { NgModule } from '@angular/core';
import { OcurrenceEventsService } from './service/ocurrence-event.service';
import { EventsService } from './service/events.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [OcurrenceEventsService, EventsService],
    bootstrap: []
})
export class EventsModule {}
