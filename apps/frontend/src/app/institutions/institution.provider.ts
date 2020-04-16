import { NgModule } from '@angular/core';
import { InstitutionService } from './service/institution.service';
import { GeoreferenciaService } from './service/georeferencia.service';

@NgModule({
    providers: [InstitutionService, GeoreferenciaService]
})
export class InstitutionProvidersModule { }
