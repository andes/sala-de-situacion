import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { LocationService } from '../../../shared/location.services';
import { InstitutionService } from '../../service/institution.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../login/services/auth.services';
import { GeoreferenciaService } from '../../service/georeferencia.service';
import { Utils } from './../../../shared/utils';
import { EventsService } from '../../../events/service/events.service';

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
        codigo: {
            sisa: ''
        },
        events: [],
        referente: {
            nombre: '',
            apellido: '',
            telefono: ''
        },
        representante: {
            nombre: '',
            apellido: '',
            telefono: ''
        },
        activo: false,
        institutions: [],
        users: []
    };
    neuquen = true;
    provincias = [];
    localidades = [];
    barrios = [];
    eventos = [];
    public selectedEvent: any = {};
    institutionParam = null;
    geoReferenciaAux = []; // Coordenadas para la vista del mapa.
    infoMarcador: String = null;
    public instituciones = [];
    public isAdmin;
    public disableGuardar = false;
    public selectedInstitution: any = {};

    constructor(
        public route: ActivatedRoute, // Permite obtener objetos o datos por parámetro.
        public plex: Plex,
        private locationService: LocationService,
        private institutionService: InstitutionService,
        private router: Router,
        private auth: AuthService,
        private georeferenciaService: GeoreferenciaService,
        private eventsService: EventsService
    ) { }

    ngOnInit() {
        this.isAdmin = this.auth.checkPermisos('admin:true');
        this.institutionParam = this.route.snapshot.params; // Si viene un id es un update
        if (this.institutionParam.id) {
            this.institutionService.get(this.institutionParam.id).subscribe(rta => {
                this.loadInstitution(rta);
                this.inicializarMapa();
                this.neuquen = this.institutionParam.provincia === 'Neuquén' ? true : false;
                this.locationService.getLocalidades({ provincia: this.institution.location.provincia.id }).subscribe(rta => {
                    this.localidades = rta;
                });
            });
        } else {
            this.institution.location.provincia = this.provNeuquen;
            this.locationService.getLocalidades({ provincia: this.institution.location.provincia.id }).subscribe(rta => {
                this.localidades = rta;
            });
        }
        this.locationService.getProvincias({}).subscribe(rta => {
            this.provincias = rta;
        });
        this.loadInstituciones();
        this.loadEventos();
    }

    loadInstitution(institucion) {
        this.institution.id = institucion.id;
        this.institution.nombre = institucion.nombre;
        this.institution.email = institucion.email;
        this.institution.telefono = institucion.telefono;
        this.institution.codigo.sisa = institucion.codigo ? institucion.codigo.sisa : '';;
        this.institution.referente.nombre = institucion.referente ? institucion.referente.nombre : '';
        this.institution.referente.apellido = institucion.referente ? institucion.referente.apellido : '';
        this.institution.referente.telefono = institucion.referente ? institucion.referente.telefono : '';
        this.institution.representante.nombre = institucion.representante ? institucion.representante.nombre : '';
        this.institution.representante.apellido = institucion.representante ? institucion.representante.apellido : '';
        this.institution.representante.telefono = institucion.representante ? institucion.representante.telefono : '';
        this.institution.institutions = institucion.institutions;
        this.institution.users = institucion.users;
        this.institution.events = institucion.events;
        this.institution.location.direccion = institucion.direccion ? institucion.direccion : '';
        this.institution.location.barrio = institucion.barrio
            ? this.locationService.getBarrios({ nombre: institucion.barrio }).subscribe(barrios => {
                this.institution.location.barrio = barrios[0];
            })
            : '';
        this.institution.location.localidad = institucion.localidad
            ? this.locationService.getLocalidades({ nombre: institucion.localidad }).subscribe(localidades => {
                this.institution.location.localidad = localidades[0];
            })
            : '';
        this.institution.location.provincia = institucion.provincia
            ? this.locationService.getProvincias({ nombre: institucion.provincia }).subscribe(provincias => {
                this.institution.location.provincia = provincias[0];
            })
            : '';
        this.institution.activo = institucion.activo;
        this.institution.location.coordenadas = institucion.coordenadas ? JSON.parse("[" + institucion.coordenadas + "]") : []; //Convierte a array las corrdenadas
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
        if (this.institution.location.provincia) {
            this.locationService.getLocalidades({ provincia: this.institution.location.provincia.id }).subscribe(rta => {
                this.localidades = rta;
            });
        }
    }

    changeLocalidad(event) {
        this.institution.location.barrio = {};
        if (this.institution.location.localidad) {
            this.locationService.getBarrios({ localidad: this.institution.location.localidad.id }).subscribe(rta => {
                this.barrios = rta;
            });
        }
    }

    loadInstituciones() {
        this.institutionService.search({}).subscribe(resultado => {
            this.instituciones = this.institution.id ? resultado.filter(item => item.id != this.institution.id) : resultado;
        });
    }

    guardar($event) {
        if ($event.formValid) {
            try {
                let dto = {
                    id: this.institution.id,
                    nombre: this.institution.nombre,
                    email: this.institution.email,
                    telefono: this.institution.telefono,
                    codigo: {
                        sisa: this.institution.codigo.sisa
                    },
                    referente: {
                        nombre: this.institution.referente.nombre,
                        apellido: this.institution.referente.apellido,
                        telefono: this.institution.referente.telefono
                    },
                    representante: {
                        nombre: this.institution.representante.nombre,
                        apellido: this.institution.representante.apellido,
                        telefono: this.institution.representante.telefono
                    },
                    institutions: this.institution.institutions,
                    direccion: this.institution.location.direccion,
                    barrio: this.institution.location.barrio.nombre ? this.institution.location.barrio.nombre : '',
                    localidad: this.institution.location.localidad.nombre,
                    provincia: this.institution.location.provincia.nombre,
                    activo: this.institution.activo,
                    coordenadas: [],
                    events: this.institution.events
                };
                if (this.institution.location.provincia && this.institution.location.localidad && this.institution.location.direccion) {
                    let direccionCompleta = this.institution.location.direccion + ', ' + this.institution.location.localidad.nombre
                        + ', ' + this.institution.location.provincia.nombre;
                    // se calcula la georeferencia
                    this.georeferenciaService.get({ direccion: direccionCompleta }).subscribe(point => {
                        if (point && point.lat && point.lng) {
                            this.institution.location.coordenadas = [point.lat, point.lng];
                            dto.coordenadas = [point.lat, point.lng];
                        }
                        this.guardarInstitucion(dto);
                    });
                } else {
                    this.guardarInstitucion(dto);
                }
            }
            catch (err) {
                this.plex.info('danger', 'Error al guardar la institución');
            }
        }
    }

    guardarInstitucion(institucion) {
        this.institutionService.save(institucion).subscribe(rta => {
            this.plex.toast('success', `La institución ${rta.nombre} se guardó correctamente`);
            this.mainInsitutions();
        });
    }

    cancelar() {
        this.mainInsitutions();
    }

    mainInsitutions() {
        this.router.navigate(['/institution/list']);
    }

    verificarFormatoEmail() {
        let utils = new Utils();
        this.disableGuardar = !utils.verificarFormatoEmail(this.institution.email);
    }

    inicializarMapa() {
        if (this.institution.location.coordenadas) {
            this.geoReferenciaAux = this.institution.location.coordenadas;
        }
    }

    changeCoordenadas(coordenadas) {
        this.geoReferenciaAux = coordenadas;    // Se actualiza vista del mapa
        this.institution.location.coordenadas = coordenadas;    // Se asigna nueva georeferencia al paciente
    }

    loadEventos() {
        this.eventsService.search({}).subscribe(resultado => {
            this.eventos = resultado;
        });
    }

    addEventToInstitution() {
        let existeRelacionado = this.institution.events.filter(item => item.id === this.selectedEvent.id).length > 0;
        if (existeRelacionado) {
            this.plex.toast('danger', `La institución ya poseé el evento.`);
        } else {
            this.institution.events.push(this.selectedEvent);
            this.selectedEvent = {};
        }
    }
    deleteEventFromInstitution(related) {
        var index = this.institution.events.indexOf(related);
        this.institution.events.splice(index, 1);
    }
}
