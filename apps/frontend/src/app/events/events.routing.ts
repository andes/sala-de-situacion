import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppEventsCrudComponent } from './components/events-crud/events-crud.component';
import { EventsListComponent } from './components/events-list/events-list.component';

const routes: Routes = [
    { path: '', component: EventsListComponent, pathMatch: 'full' },
    { path: 'create', component: AppEventsCrudComponent }
    // { path: ':id', component: AppEventsCrudComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class EventsRouting {}
