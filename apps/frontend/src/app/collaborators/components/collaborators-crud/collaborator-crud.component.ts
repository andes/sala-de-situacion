import { UserService } from './../../../login/services/user.services';
import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { CollaboratorService } from '../../service/collaborator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../login/services/auth.services';
import { Utils } from '../../../shared/utils';
import { InstitutionService } from '../../../institutions/service/institution.service';

@Component({
    selector: 'collaborator-crud',
    templateUrl: './collaborator-crud.component.html'
})
export class AppCollaboratorCrudComponent implements OnInit {
    public collaborator = {
        id: '',
        email: '',
        user: '',
        institution: '',
        password: '',
        codigoNacion: '',
        activo: false,
    };
    collaboratorParam = null;
    public disableGuardar = false;
    public instituciones = [];
    public users = [];

    constructor(
        public route: ActivatedRoute, // Permite obtener objetos o datos por parámetro.
        public plex: Plex,
        private collaboratorService: CollaboratorService,
        private router: Router,
        private auth: AuthService,
        private institutionService: InstitutionService,
        private userService: UserService,
    ) { }

    ngOnInit() {
        if (!this.auth.checkPermisos('admin:true')) {
            this.router.navigate(['/']);
        }
        this.loadInstituciones();
        this.loadUsers();
        this.collaboratorParam = this.route.snapshot.params; // Si viene un id es un update
        if (this.collaboratorParam.id) {
            this.collaboratorService.get(this.collaboratorParam.id).subscribe(rta => {
                this.loadCollaborator(rta);
            });
        }
    }

    loadCollaborator(collaborator) {
        this.collaborator.id = collaborator.id;
        this.collaborator.email = collaborator.email;
        this.collaborator.user = collaborator.user;
        this.collaborator.institution = collaborator.institution;
        this.collaborator.codigoNacion = collaborator.codigoNacion;
        this.collaborator.activo = collaborator.activo;
        this.collaborator.password = collaborator.password;
    }

    loadInstituciones() {
        this.institutionService.getInstituciones({}).subscribe(resultado => {
            this.instituciones = resultado;
        });
    }

    loadUsers() {
        this.userService.search({}).subscribe(resultado => {
            this.users = resultado;
        });
    }

    guardar($event) {
        if ($event.formValid) {
            try {
                let dto = {
                    id: this.collaborator.id,
                    email: this.collaborator.email,
                    activo: this.collaborator.activo,
                    institution: this.collaborator.institution,
                    codigoNacion: this.collaborator.codigoNacion,
                    user: this.collaborator.user,
                    password: this.collaborator.password
                };
                this.guardarCollaborator(dto);
            }
            catch (err) {
                this.plex.info('danger', 'Error al guardar el colaborador');
            }
        }
    }

    guardarCollaborator(collaborator) {
        this.collaboratorService.save(collaborator).subscribe(rta => {
            this.plex.toast('success', `El colaborador ${rta.email} se guardó correctamente`);
            this.mainCollaborators();
        });
    }

    cancelar() {
        this.mainCollaborators();
    }

    mainCollaborators() {
        this.router.navigate(['/collaborator/list']);
    }

    verificarFormatoEmail() {
        let utils = new Utils();
        this.disableGuardar = !utils.verificarFormatoEmail(this.collaborator.email);
    }

}
