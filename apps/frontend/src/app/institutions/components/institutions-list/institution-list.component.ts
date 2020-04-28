import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { LocationService } from '../../../shared/location.services';
import { InstitutionService } from '../../service/institution.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { cache } from '@andes/shared';

@Component({
  selector: 'institutionListComponent',
  templateUrl: './institution-list.component.html'
})
export class AppInstitutionListComponent implements OnInit {
  public institutions$: Observable<any[]>;
  public institutions = [];
  public institucion = null;
  public nombre = null;
  public estados: any[];
  public estado = null;
  public localidad = null;
  public localidades: any[] = [];
  public provincia = null;
  public provincias: any[] = [];
  public activateInstitution = false;
  constructor(
    public plex: Plex,
    private locationService: LocationService,
    private institutionService: InstitutionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.institutions$ = this.institutionService.search().pipe(cache());
    this.institutionService.search({}).subscribe(rta => {
      this.institutions = rta;
    });
    this.locationService.getProvincias({}).subscribe(rta => {
      this.provincias = rta;
    });
    this.estados = [{ id: 'true', nombre: 'Habilitada' }, { id: 'false', nombre: 'No habilitada' }];
    this.filtrarResultados();
  }

  edit(institution) {
    this.institucion = institution;
    this.router.navigate(['/institution/crud', institution]);
  }

  onClose() {
    this.activateInstitution = false;
    this.institucion = null;
  }

  onSave() {
    this.institutionService.update(this.institucion.id, { activo: this.institucion.activo }).subscribe(rta => {
      this.plex.toast('success', `La institución ${rta.nombre} ha sido actualizada correctamente`);
      this.institucion = null;
      this.activateInstitution = false;
    });
  }

  changeProvincia(event) {
    if (this.provincia) {
      this.locationService.getLocalidades({ provincia: this.provincia.id }).subscribe(rta => {
        this.localidades = rta;
      });
    } else {
      this.localidades = [];
    }
    this.filtrarResultados();
  }

  create() {
    this.router.navigate(['/institution/crud']);
  }

  mainMenu() {
    this.router.navigate(['/']);
  }

  filtrarResultados() {
    this.institutions$.subscribe(value => {
      this.institutions = value;
      if (this.nombre) {
        this.institutions = this.institutions.filter(e => e.nombre.toLowerCase().search(this.nombre.toLowerCase()) != -1);
      }
      if (this.estado) {
        this.institutions = this.institutions.filter(e => e.activo.toString() === this.estado.id);
      }
      if (this.provincia) {
        this.institutions = this.institutions.filter(e => e.provincia === this.provincia.nombre);
        if (this.localidad) {
          this.institutions = this.institutions.filter(e => e.localidad === this.localidad.nombre);
        }
      }
    });
  }
}
