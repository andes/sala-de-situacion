import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OccurrenceEventsCrudComponent } from './components/ocurrence-events-crud/ocurrence-events-crud.component';
import { OcurrenceEventsListComponent } from './components/ocurrence-events-list/ocurrence-events-list.component';
import { OcurrenceEventsResolver } from './resolver/ocurrence-events.resolver';
import { OccurrenceEventsImportComponent } from './components/ocurrence-events-import/ocurrence-events-import.component';

const routes: Routes = [
    { path: '', component: OcurrenceEventsListComponent, pathMatch: 'full' },
    { path: 'import', component: OccurrenceEventsImportComponent },
    { path: 'create', component: OccurrenceEventsCrudComponent },
    {
        path: ':id',
        component: OccurrenceEventsCrudComponent,
        resolve: {
            ocurrenceEvent: OcurrenceEventsResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class OcurrenceEventsRouting {}
