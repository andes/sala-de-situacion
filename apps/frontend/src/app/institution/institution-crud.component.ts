import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { LocationService } from '../shared/location.services';
import { InstitutionService } from './institution.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'institution-crud',
    templateUrl: './institution-crud.component.html'
})
export class AppInstitutionCrudComponent implements OnInit {
    provNeuquen = {
        _id: '5e80b38065773d7db8dc6015',
        nombre: 'Neuquén'
        //id: '5e80b38065773d7db8dc6015'
    };
    public institution = {
        id: '',
        nombre: '',
        email: '',
        telefono: '',
        location: {
            provincia: null,
            localidad: null,
            barrio: null,
            direccion: '',
            coordenadas: []
        },
        activo: false
    };
    neuquen = true;
    update = false;
    provincias = [];
    localidades = [];
    barrios = [];
    institutionParam = null;
    // Georref-map
    geoReferenciaAux = []; // Coordenadas para la vista del mapa.
    infoMarcador: String = null;

    constructor(
        public route: ActivatedRoute, // Permite obtener objetos o datos por parámetro.
        public plex: Plex,
        private locationService: LocationService,
        private institutionService: InstitutionService,
        private router: Router
    ) { }

    ngOnInit() {
        this.institutionParam = this.route.snapshot.params; // Si viene un objeto es un update
        if (this.institutionParam.id) {
            this.update = true;
            this.loadInstitution(this.institutionParam);
            this.neuquen = this.institutionParam.provincia === 'Neuquén' ? true : false;
        } else {
            this.institution.location.provincia = this.provNeuquen;
        }
        // Cargamos todas las provincias
        this.locationService.getProvincias({}).subscribe(rta => {
            this.provincias = rta;
        });
        // Cargamos todas las localidades
        this.locationService.getLocalidades({ provincia: this.institution.location.provincia.id }).subscribe(rta => {
            this.localidades = rta;
        });
    }

    loadInstitution(institucion) {
        this.institution.id = institucion.id;
        this.institution.nombre = institucion.nombre;
        this.institution.email = institucion.email;
        this.institution.telefono = institucion.telefono;
        this.institution.location.direccion = institucion.direccion ? institucion.direccion : null;
        this.institution.location.barrio = institucion.barrio
            ? this.locationService.getBarrio(institucion.barrio).subscribe(barrios => {
                this.institution.location.barrio = barrios[0];
            })
            : '';
        this.institution.location.localidad = institucion.localidad
            ? this.locationService.getLocalidad(institucion.localidad).subscribe(localidades => {
                this.institution.location.localidad = localidades[0];
            })
            : '';
        this.institution.location.provincia = institucion.provincia
            ? this.locationService.getProvincia(institucion.provincia).subscribe(provincias => {
                this.institution.location.provincia = provincias[0];
            })
            : '';
        this.institution.activo = institucion.activo === 'true' ? true : false;
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
            id: this.institution.id,
            nombre: this.institution.nombre,
            email: this.institution.email,
            telefono: this.institution.telefono,
            direccion: this.institution.location.direccion,
            barrio: this.institution.location.barrio.nombre,
            localidad: this.institution.location.localidad.nombre,
            provincia: this.institution.location.provincia.nombre,
            activo: this.institution.activo
        };

        if (this.update) {
            this.institutionService.update(this.institution.id, dto).subscribe(rta => {
                this.plex.toast('success', `La institución ${rta.nombre} ha sido actualizada correctamente`);
                this.mainInsitutions();
            });
        } else {
            delete dto['id'];

            this.institutionService.save(dto).subscribe(rta => {
                this.plex.toast('success', `La institución ${rta.nombre} se guardó correctamente`);
                this.mainInsitutions();
            });
        }
    }

    cancelar() {
        this.mainInsitutions();
    }

    mainInsitutions() {
        this.router.navigate(['/institution/list']);
    }
}
