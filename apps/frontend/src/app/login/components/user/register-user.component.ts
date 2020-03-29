import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
import { IUsuario } from './IUsuario.interfaces';

@Component({
  selector: 'register-user',
  templateUrl: './register-user.html'
})
export class RegisterUserComponent implements OnInit {
  public email = '';
  public disableEnviar = false;
  usuario = {
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: ''
  };


  constructor(
    public plex: Plex,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  enviar() {
    this.disableEnviar = true;
    this.auth.create(this.usuario).subscribe(
      data => {
        this.sendEmailVerification();
      },
      err => {
      }
    );
  }

  sendEmailVerification() {
    // se envia email al usuario
    this.router.navigate(['login/verify-email/' + this.usuario.email]);
  }

  cancelar() {
    this.router.navigate(['login']);
  }


}
