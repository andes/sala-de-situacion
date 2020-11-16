import { AppCollaboratorListComponent } from './components/collaborators-list/collaborator-list.component';
import { AppCollaboratorCrudComponent } from './components/collaborators-crud/collaborator-crud.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReportEventsComponent } from './components/report-events/report-events.component';


const routes: Routes = [
    {
        path: 'crud',
        component: AppCollaboratorCrudComponent
    },
    {
        path: 'list',
        component: AppCollaboratorListComponent
    },
    { 
        path: 'report-events',
        component: ReportEventsComponent 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class CollaboratorRouting { }
