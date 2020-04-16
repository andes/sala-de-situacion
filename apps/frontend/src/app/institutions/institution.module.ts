import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

import { AppInstitutionCrudComponent } from './components/institutions-crud/institution-crud.component';
import { AppInstitutionListComponent } from './components/institutions-list/institution-list.component';

import { InstitutionRouting } from './institution.routing';
import { GeorrefMapComponent } from './components/georeferencia/georref-map.component';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, PlexModule, InstitutionRouting],
    declarations: [AppInstitutionCrudComponent, AppInstitutionListComponent, GeorrefMapComponent],
    providers: []
})
export class InstitutionModule { }
