import { CheckoutsService } from './services/checkout.service';
import { ImporterRouting } from './importer.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { ImporterComponent } from './components/importer.component';
import { OcupationsService } from './services/ocupation.service';
import { ImportsComponent } from './components/imports/imports.component';
import { CheckImportComponent } from './components/checkimport.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        ImporterRouting
    ],
    exports: [
        ImporterComponent,
        ImportsComponent,
        CheckImportComponent
    ],
    declarations: [
        ImporterComponent,
        ImportsComponent,
        CheckImportComponent
    ],
    providers: [
        OcupationsService,
        CheckoutsService
    ]
})
export class ImporterModule { }
