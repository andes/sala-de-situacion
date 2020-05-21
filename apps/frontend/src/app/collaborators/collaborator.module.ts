import { AppCollaboratorListComponent } from './components/collaborators-list/collaborator-list.component';
import { AppCollaboratorCrudComponent } from './components/collaborators-crud/collaborator-crud.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { CollaboratorRouting } from './collaborator.routing';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, PlexModule, CollaboratorRouting],
    declarations: [AppCollaboratorCrudComponent, AppCollaboratorListComponent],
    providers: []
})
export class CollaboratorModule { }
