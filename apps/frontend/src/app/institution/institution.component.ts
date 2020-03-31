import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { LocationService } from '../shared/location.services';
import { InstitutionService } from './institution.service';
import { Router } from '@angular/router';

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
        location: {
            provincia: this.provNeuquen,
            localidad: null,
            barrio: null,
            direccion: '',
            coordenadas: []
        }
    };
    neuquen = true;
    provincias = [];
    localidades = [];
    barrios = [];

    // Georref-map
    geoReferenciaAux = []; // Coordenadas para la vista del mapa.
    infoMarcador: String = null;

    constructor(
        public plex: Plex,
        private locationService: LocationService,
        private institutionService: InstitutionService,
        private router: Router
    ) {}

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

    guardar() {
        let dto = {
            nombre: this.institution.nombre,
            email: this.institution.email,
            telefono: this.institution.telefono,
            direccion: this.institution.location.direccion,
            barrio: this.institution.location.barrio.nombre,
            localidad: this.institution.location.localidad.nombre,
            provincia: this.institution.location.provincia.nombre
        };

        this.institutionService.save(dto).subscribe(rta => {
            this.plex.toast('success', `La institución ${rta.nombre} se guardó correctamente`);
            this.router.navigate(['/home']);
        });
    }
}
