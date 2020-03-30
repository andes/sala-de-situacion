import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.services';
import { IUsuario } from '../user/IUsuario.interfaces';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'activacion-cuenta',
    templateUrl: './activacion-cuenta.html'
})
export class ActivacionCuentaComponent implements OnInit {
    public email = '';
    user$: Observable<IUsuario>;
    constructor(public plex: Plex, private route: ActivatedRoute, private router: Router, private auth: AuthService) {}

    ngOnInit() {
        //Activar la cuenta
        this.email = this.route.snapshot.paramMap.get('email');
        //Busca el email y activa la cuenta
        this.user$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => this.auth.activarCuenta(params.get('email')))
        );
    }

    volver() {
        this.router.navigate(['login']);
    }
}
