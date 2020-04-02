import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppEventsCrudComponent } from './components/events-crud/events-crud.component';

const routes: Routes = [
    { path: 'create', component: AppEventsCrudComponent }
    // { path: ':id', component: AppEventsCrudComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class EventsRouting {}
