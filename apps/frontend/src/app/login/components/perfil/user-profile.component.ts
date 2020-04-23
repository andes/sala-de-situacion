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

  public institutions = [];
  public users: any[];
  public candidateUsers = [];
  public user;
  showResetPassword = false;
  showUsarios = [];

  public loading = false;
  public password1 = '';
  public password2 = '';
  public passwordActual = '';
  public token;
  constructor(
    public plex: Plex,
    public auth: AuthService,
    private institutionService: InstitutionService,
    private userService: UserService
  ) { }

  usuario: any = {};
  selectedUser: any = {};

  ngOnInit(): void {
    this.auth.getSession().subscribe((sessionUser) => {
      this.user = sessionUser;
    });
    let paramsInstitutions: any = {};
    paramsInstitutions.user = this.user.id;
    this.institutionService.search(paramsInstitutions).subscribe(
      registros => {
        this.institutions = registros;
        this.userService.search().subscribe(
          registros => {
            this.users = registros;
            this.institutions.forEach((inst) => {
              const institutionUsers = inst.users.map((u) => u.documento);
              let candidates: any[] = this.users.filter(item => institutionUsers.indexOf(item.documento) < 0);
              this.candidateUsers[inst.id] = {
                users: candidates
              };
            });
          },
          (err) => {
          }
        );
      },
      (err) => {
      }
    );
    console.log(this.candidateUsers);
  }

  showResetForm() {
    this.showResetPassword = !this.showResetPassword;
  }

  addUserToInstitution(institution) {
    institution.users.push(this.selectedUser);
    this.institutionService.save(institution).subscribe(rta => {
      this.plex.toast('success', `El usuario fue agregado correctamente a la institución ${rta.nombre}.`);
      var index = this.candidateUsers[institution.id].users.indexOf(this.selectedUser);
      this.candidateUsers[institution.id].users.splice(index, 1);
      this.selectedUser = {};
    });
  }

  deleteUserFromInstitution(institution, user) {
    var index = institution.users.indexOf(user);
    institution.users.splice(index, 1);
    this.institutionService.save(institution).subscribe(rta => {
      this.plex.toast('success', `El usuario fue desvinculado correctamente de la institución ${rta.nombre}.`);
      this.candidateUsers[institution.id].users.push(user);
    });
  }

  save(password) {

  }
}
