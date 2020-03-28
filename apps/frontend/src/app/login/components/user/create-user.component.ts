import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../components/login/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'create-user',
  templateUrl: './create-user.html'
})
export class CreateUserComponent implements OnInit {
  public email = '';
  usuario = {
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  };

  constructor(
    public plex: Plex,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  enviar() {
    this.auth.create(this.usuario).subscribe(
      data => {
        this.router.navigate(['/login']);
      },
      err => {
      }
    );

  }


}
