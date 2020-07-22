import { User } from './../../../../../../backend/src/app/users/user.interface';
import { UserService } from './../../services/user.services';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { Plex } from '@andes/plex';
import { Observable } from 'rxjs';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { cache } from '@andes/shared';
import { Router } from '@angular/router';


@Component({
    selector: 'users-admin',
    templateUrl: './users.html'
})
export class UsersComponent implements OnInit {

    // Usuarios
    users$: Observable<User[]>;
    public users = [];
    // Filtros
    public institutions = [];
    public selectedInstitution;
    public documento;
    public email;
    // Permisos
    public showModalPermisos = false;
    public usuarioPermisos: any = {};

    constructor(
        public plex: Plex,
        public auth: AuthService,
        private userService: UserService,
        private router: Router,
        private institutionService: InstitutionService
    ) { }

    ngOnInit(): void {
        if (!this.auth.checkPermisos('admin:true')) {
            this.router.navigate(['/']);
        }
        this.users$ = this.userService.search().pipe(cache());
        this.loadInstitutions();
        this.filtrarResultados();
    }

    loadInstitutions() {
        this.institutionService.search({}).subscribe(rtaInstitutions => this.institutions = rtaInstitutions);
    }

    resetModals() {
        this.showModalPermisos = false;
    }

    verPermisos(user) {
        this.usuarioPermisos = user;
        this.showModalPermisos = true;
    }

    filtrarResultados() {
        this.users$.subscribe(registros => {
            this.users = registros;
            if (this.documento) {
                this.users = this.users.filter(e => e.documento.includes(this.documento, 'i'));
            }
            if (this.email) {
                this.users = this.users.filter(e => e.email.includes(this.email, 'i'));
            }
            if (this.selectedInstitution) {
                const usersInstitucion = this.selectedInstitution.users.map(element => element._id);
                this.users = this.users.filter(e => usersInstitucion.includes(e.id));
            }
        },
            (err) => this.plex.info('danger', 'Error al cargar los usuarios')
        );
    }
}
