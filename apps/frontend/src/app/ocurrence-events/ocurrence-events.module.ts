import { NgModule } from '@angular/core';
import { NgxObserveModule } from 'ngx-observe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { OcurrenceEventsRouting } from './ocurrence-events.routing';
import { OcurrenceEventsService } from './services/ocurrence-events.service';
import { RouterModule } from '@angular/router';
import { OccurrenceEventsCrudComponent } from './components/ocurrence-events-crud/ocurrence-events-crud.component';
import { OcurrenceEventsListComponent } from './components/ocurrence-events-list/ocurrence-events-list.component';
import { OcurrenceEventsResolver } from './resolver/ocurrence-events.resolver';

@NgModule({
    // prettier-ignore
    declarations: [
        OccurrenceEventsCrudComponent,
        OcurrenceEventsListComponent
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
        OcurrenceEventsService,
        OcurrenceEventsResolver
    ],
    bootstrap: []
})
export class OcurrenceEventsModule {}
