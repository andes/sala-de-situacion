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
  showModalResetPassword = false;
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

  toggleResetForm() {
    this.showModalResetPassword = !this.showModalResetPassword;
  }

  toggleShowUsuarios(i) {
    this.showUsarios[i] = !this.showUsarios[i];
  }

  refreshCandidates(id) {
    this.candidateUsers[id].users = [...this.candidateUsers[id].users];
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
        var index = this.candidateUsers[institution.id].users.indexOf(this.selectedUser);
        this.candidateUsers[institution.id].users.splice(index, 1);
        this.selectedUser = {};
        this.refreshCandidates(institution.id);
      });
    }
  }

  deleteUserFromInstitution(institution, user) {
    var index = institution.users.indexOf(user);
    institution.users.splice(index, 1);
    this.institutionService.save(institution).subscribe(rta => {
      this.plex.toast('success', `El usuario fue desvinculado correctamente de la institución ${rta.nombre}.`);
      this.candidateUsers[institution.id].users = [...this.candidateUsers[institution.id].users, user];
      this.refreshCandidates(institution.id);
    });
  }

  save(password) {

  }
}
