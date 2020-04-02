import { NgModule } from '@angular/core';
import { OcurrenceEventsService } from './service/ocurrence-event.service';
import { EventsService } from './service/events.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { EventsRouting } from './events.routing';
import { AppEventsCrudComponent } from './components/events-crud/events-crud.component';

@NgModule({
    // prettier-ignore
    declarations: [
        AppEventsCrudComponent
    ],
    // prettier-ignore
    imports: [
        CommonModule, 
        FormsModule, 
        HttpClientModule, 
        PlexModule, 
        EventsRouting
    ],
    // prettier-ignore
    providers: [
        OcurrenceEventsService, 
        EventsService
    ],
    bootstrap: []
})
export class EventsModule {}
