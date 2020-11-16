import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReportEventsComponent } from './report-events.component';

const routes: Routes = [
    { path: '/collaborator/report-events', component: ReportEventsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})
export class ReportEventsRouting { }
