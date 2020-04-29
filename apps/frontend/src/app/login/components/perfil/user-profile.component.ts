import { UserService } from './../../services/user.services';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Plex } from '@andes/plex';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {

    // Current user
    public user;
    // Institutions
    public institutions = [];
    public showUsarios = [];
    // User Model
    public selectedUser: any = {};
    // Reset password
    public showModalResetPassword = false;
    public loading = false;
    public password1 = '';
    public password2 = '';
    public passwordActual = '';
    public token;
    // Sugerencias
    public showModalSugerencias = false;
    public sugerencias: any = {};

    constructor(
        public plex: Plex,
        public auth: AuthService,
        private institutionService: InstitutionService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.auth.getSession().subscribe((sessionUser) => {
            this.user = sessionUser;
        });
        let paramsInstitutions: any = {};
        paramsInstitutions.user = this.user.id;
        this.institutionService.search(paramsInstitutions).subscribe(
            registros => {
                this.institutions = registros;
            },
            (err) => {
            }
        );
    }

    toggleResetForm() {
        this.showModalResetPassword = !this.showModalResetPassword;
    }

    toggleShowUsuarios(i) {
        this.showUsarios[i] = !this.showUsarios[i];
    }

    toggleShowSugerencias() {
        this.showModalSugerencias = !this.showModalSugerencias;
    }

    resetModals() {
        this.showModalResetPassword = false;
        this.showModalSugerencias = false;
    }

    loadUsers(event) {
        if (event.query) {
            let query = {
                search: "^" + event.query
            };
            this.userService.search
                (query).subscribe(resultado => {
                    event.callback(resultado);
                });
        } else {
            event.callback([this.selectedUser] || []);
        }
    }

    addUserToInstitution(institution) {
        let existeUsuario = institution.users.filter(item => item.id === this.selectedUser.id).length > 0;
        if (existeUsuario) {
            this.plex.toast('danger', `El usuario ya se encuenta asociado a la institución.`);
        } else {
            institution.users.push(this.selectedUser);
            this.institutionService.save(institution).subscribe(rta => {
                this.plex.toast('success', `El usuario fue agregado correctamente a la institución ${rta.nombre}.`);
                this.selectedUser = {};
            });
        }
    }

    deleteUserFromInstitution(institution, user) {
        var index = institution.users.indexOf(user);
        institution.users.splice(index, 1);
        this.institutionService.save(institution).subscribe(rta => {
            this.plex.toast('success', `El usuario fue desvinculado correctamente de la institución ${rta.nombre}.`);
        });
    }

}
