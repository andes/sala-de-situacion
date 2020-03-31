import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';

import { AppInstitutionComponent } from './institution.component';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, PlexModule],
    declarations: [AppInstitutionComponent],
    providers: []
})
export class InstitutionModule {}
