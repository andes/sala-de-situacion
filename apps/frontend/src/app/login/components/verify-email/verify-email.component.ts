import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Plex } from '@andes/plex';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'verify-email',
  templateUrl: './verify-email.html'
})
export class VerifyEmailComponent implements OnInit {
  public email = '';
  constructor(
    public plex: Plex,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
    //Busca el email y verifica el estado de la cuenta

  }

  reenviar() {
    //Verifica que la cuenta no esté activa
    //Si aún no está activa reenvia el mail

    //Si está activa lo redirige al login con un mensaje de cuenta validada
    //Para ingresar con usuario y contraseña

  }

  login() {
    this.router.navigate(['login'])
  }


}
