import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../login/auth.services';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Plex } from '@andes/plex';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {

    public institutions = [];
    public user;
    showModalResetPassword = false;
    showUsarios = [];
    constructor(
        public plex: Plex,
        private auth: AuthService,
        private institutionService: InstitutionService
    ) { }

    usuario: any = {};
    token = '';

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

    reset() {
        this.showModalResetPassword = true;
    }

    close(event) {
        this.showModalResetPassword = false;
    }

    addUserToInstitution(institution, user) {
        institution.users.push(user);
        this.institutionService.save(institution).subscribe(rta => {
            this.plex.toast('success', `El usuario fue agregado correctamente a la institución ${rta.nombre}.`);
        });
    }
}
