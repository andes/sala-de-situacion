import { NgModule } from '@angular/core';
import { NgxObserveModule } from 'ngx-observe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { EventsRouting } from './events.routing';
import { OcurrenceEventsService } from './service/ocurrence-event.service';
import { EventsService } from './service/events.service';
import { AppEventsCrudComponent } from './components/events-crud/events-crud.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
    // prettier-ignore
    declarations: [
        AppEventsCrudComponent,
        EventsListComponent
    ],
    // prettier-ignore
    imports: [
        CommonModule, 
        FormsModule, 
        HttpClientModule, 
        RouterModule,
        PlexModule,
        NgxObserveModule, 
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
