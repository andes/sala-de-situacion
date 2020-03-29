import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { LocationService } from '../shared/location.services';

@Component({
    selector: 'institution',
    templateUrl: './institution.component.html'
})
export class AppInstitutionComponent implements OnInit {
    provNeuquen = {
        _id: '5e80b38065773d7db8dc6015',
        nombre: 'Neuquén',
        id: '5e80b38065773d7db8dc6015'
    };
    institution = {
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        location: {
            provincia: this.provNeuquen,
            localidad: null,
            barrio: null
        }
    };
    neuquen = true;
    provincias = [];
    localidades = [];
    barrios = [];

    constructor(public plex: Plex, private locationService: LocationService) {}

    ngOnInit() {
        // Cargamos todas las provincias
        this.locationService.getProvincias({}).subscribe(rta => {
            this.provincias = rta;
        });
        this.locationService.getLocalidades({ provincia: this.institution.location.provincia.id }).subscribe(rta => {
            this.localidades = rta;
        });
    }

    setNeuquen(event) {
        if (event.value) {
            this.institution.location.provincia = this.provNeuquen;
            this.locationService
                .getLocalidades({ provincia: this.institution.location.provincia.id })
                .subscribe(rta => {
                    this.localidades = rta;
                });
        }
    }

    changeProvincia(event) {
        this.institution.location.localidad = {};
        this.institution.location.barrio = {};
        this.locationService.getLocalidades({ provincia: this.institution.location.provincia.id }).subscribe(rta => {
            this.localidades = rta;
        });
    }

    changeLocalidad(event) {
        this.institution.location.barrio = {};
        this.locationService.getBarrios({ localidad: this.institution.location.localidad.id }).subscribe(rta => {
            this.barrios = rta;
        });
    }
}
