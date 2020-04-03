import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { LocationService } from '../shared/location.services';
import { InstitutionService } from './institution.service';
import { Router } from '@angular/router';

@Component({
    selector: 'institutionListComponent',
    templateUrl: './institution-list.component.html'
})
export class AppInstitutionListComponent implements OnInit {
    public institutions = [];
    public institucion = null;
    public activateInstitution = false;
    constructor(
        public plex: Plex,
        private locationService: LocationService,
        private institutionService: InstitutionService,
        private router: Router
    ) { }

    ngOnInit() {
        this.institutionService.search({}).subscribe(rta => { this.institutions = rta });
    }

    edit(institution) {
        this.institucion = institution;
        this.activateInstitution = true
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
        })
    }

    create() {
        this.router.navigate(['/institution/institution']);
    }

}
