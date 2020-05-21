import { InstitutionService } from './../../../institutions/service/institution.service';
import { CollaboratorService } from '../../service/collaborator.service';
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { cache } from '@andes/shared';
import { AuthService } from '../../../login/services/auth.services';

@Component({
    selector: 'collaboratorListComponent',
    templateUrl: './collaborator-list.component.html'
})
export class AppCollaboratorListComponent implements OnInit {
    public collaborators$: Observable<any[]>;
    public collaborators = [];
    public collaborator = null;
    public nombre = null;
    public estados: any[];
    public estado = null;
    public institutions: any[] = [];
    public institution = null;
    public activateCollaborator = false;
    constructor(
        public plex: Plex,
        private collaboratorService: CollaboratorService,
        private institutionService: InstitutionService,
        private router: Router,
        private auth: AuthService,
    ) { }

    ngOnInit() {
        if (!this.auth.checkPermisos('admin:true')) {
            this.router.navigate(['/']);
        }
        this.collaborators$ = this.collaboratorService.search().pipe(cache());
        this.estados = [{ id: 'true', nombre: 'Activo' }, { id: 'false', nombre: 'No activo' }];
        this.loadInstituciones();
        this.filtrarResultados();
    }

    edit(collaborator) {
        this.collaborator = collaborator;
        this.router.navigate(['/collaborator/crud', { id: collaborator._id }]);
    }

    onClose() {
        this.activateCollaborator = false;
        this.collaborator = null;
    }

    onSave() {
        this.collaboratorService.update(this.collaborator.id, { activo: this.collaborator.activo }).subscribe(rta => {
            this.plex.toast('success', `El colaborador ${rta.nombre} ha sido actualizado correctamente`);
            this.collaborator = null;
            this.activateCollaborator = false;
        });
    }

    create() {
        this.router.navigate(['/collaborator/crud']);
    }

    loadInstituciones() {
        this.institutionService.search({}).subscribe(resultado => {
            this.institutions = resultado;
        });
    }

    mainMenu() {
        this.router.navigate(['/']);
    }

    filtrarResultados() {
        this.collaborators$.subscribe(value => {
            this.collaborators = value;
            if (this.estado) {
                this.collaborators = this.collaborators.filter(e => e.activo.toString() === this.estado.id);
            }
            if (this.institution) {
                this.collaborators = this.collaborators.filter(e => e.institution.id === this.institution.id);
            }
        });
    }
}
