import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OccurrenceEventsCrudComponent } from './components/ocurrence-events-crud/ocurrecen-events-crud.component';

const routes: Routes = [{ path: 'create', component: OccurrenceEventsCrudComponent, pathMatch: 'full' }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class OcurrenceEventsRouting {}
