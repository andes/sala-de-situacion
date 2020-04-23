import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../login/auth.services';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Plex } from '@andes/plex';
import { IUsuario } from '../user/IUsuario.interfaces';
import { Observable } from 'rxjs';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {

    public institutions = [];
    public user;
    showResetPassword = false;
    showUsarios = [];

    public loading = false;
    public password1 = '';
    public password2 = '';
    public passwordActual = '';
    public user$: Observable<IUsuario>;
    public token;
    users: any[];
    constructor(
        public plex: Plex,
        public auth: AuthService,
        private institutionService: InstitutionService
    ) { }

    usuario: any = {};
    selectedUsers: any = [];

    ngOnInit(): void {
        this.auth.getSession().subscribe((sessionUser) => {
            this.user = sessionUser;
            this.users = [{ ...this.user, id: 1 }];
            console.log(this.users);
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

    showResetForm() {
        this.showResetPassword = !this.showResetPassword;
    }


    addUserToInstitution(institution, user) {
        institution.users.push(user);
        this.institutionService.save(institution).subscribe(rta => {
            this.plex.toast('success', `El usuario fue agregado correctamente a la institución ${rta.nombre}.`);
        });
    }
}
