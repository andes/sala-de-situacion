import { InscripcionVacunasService } from './../../service/inscripcion-vacunas.service';
import { Component } from '@angular/core';
import { Plex } from '@andes/plex';

@Component({
    selector: 'consulta-vacunacion',
    templateUrl: './consult.component.html'
})
export class VaccinationConsultComponent {
    public sexo = 'femenino';
    public documento = null;
    public resultado = null;
    public opcionesSexo = [
        { id: 'femenino', label: 'Femenino' },
        { id: 'masculino', label: 'Masculino' }
    ];
    recaptcha: any = null;

    constructor(
        private plex: Plex, private inscripcionVacunasService: InscripcionVacunasService
    ) { }

    seleccionarSexo($event) {
        this.sexo = $event.value;
        this.limpiarRespuesta();
    }

    limpiarRespuesta() {
        this.resultado = null;
    }

    buscar() {
        if (this.recaptcha) {
            this.inscripcionVacunasService.search({ documento: this.documento, sexo: this.sexo }).subscribe(resultado => {
                if (resultado.length > 0) {
                    this.resultado = resultado[0];
                } else {
                    this.resultado = {};
                }
            })
        } else {
            this.plex.info('danger', 'Captcha no válido');
        }
    }

    resolved(captchaResponse: any[]) {
        this.recaptcha = captchaResponse;
    }

}
