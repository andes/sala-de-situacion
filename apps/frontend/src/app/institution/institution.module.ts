import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

import { AppInstitutionCrudComponent } from './institution-crud.component';
import { AppInstitutionListComponent } from './institution-list.component';

import { InstitutionRouting } from './institution.routing';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, PlexModule, InstitutionRouting],
    declarations: [AppInstitutionCrudComponent, AppInstitutionListComponent],
    providers: []
})
export class InstitutionModule {}
