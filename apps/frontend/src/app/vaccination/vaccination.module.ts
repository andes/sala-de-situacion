import { InscripcionVacunasService } from './service/inscripcion-vacunas.service';
import { VaccinationConsultComponent } from './components/consult/consult.component';
import { VaccinationRouting } from './vaccination.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, PlexModule, VaccinationRouting, RecaptchaModule],
    declarations: [VaccinationConsultComponent],
    providers: [InscripcionVacunasService]
})
export class VaccinationModule { }
