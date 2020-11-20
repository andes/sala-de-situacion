import { AppCollaboratorListComponent } from './components/collaborators-list/collaborator-list.component';
import { AppCollaboratorCrudComponent } from './components/collaborators-crud/collaborator-crud.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { CollaboratorRouting } from './collaborator.routing';
import { ReportEventsService } from './service/report-events.service';
import { ReportEventsComponent } from './components/report-events/report-events.component';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, PlexModule, CollaboratorRouting],
    declarations: [AppCollaboratorCrudComponent, AppCollaboratorListComponent, ReportEventsComponent],
    providers: [ReportEventsService]
})
export class CollaboratorModule { }
