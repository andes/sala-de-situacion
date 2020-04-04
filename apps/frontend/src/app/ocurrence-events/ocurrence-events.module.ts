import { NgModule } from '@angular/core';
import { NgxObserveModule } from 'ngx-observe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { OcurrenceEventsRouting } from './ocurrence-events.routing';
import { OcurrenceEventsService } from './services/ocurrence-event.service';
import { RouterModule } from '@angular/router';
import { OccurrenceEventsCrudComponent } from './components/ocurrence-events-crud/ocurrecen-events-crud.component';

@NgModule({
    // prettier-ignore
    declarations: [
        OccurrenceEventsCrudComponent 
    ],
    // prettier-ignore
    imports: [
        CommonModule, 
        FormsModule, 
        HttpClientModule, 
        RouterModule,
        PlexModule,
        NgxObserveModule,  
        OcurrenceEventsRouting
    ],
    // prettier-ignore
    providers: [
        OcurrenceEventsService
    ],
    bootstrap: []
})
export class OcurrenceEventsModule {}
