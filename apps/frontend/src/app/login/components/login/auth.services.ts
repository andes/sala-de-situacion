import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from '@andes/shared';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

    private pacienteAppUrl = '/modules/mobileApp/pacienteApp';  // URL to web api

    constructor(private server: Server) { }

    login(usuario: string, password: string): Observable<any> {
        return this.server.post('/login', { usuario: usuario, password: password }, { params: null, showError: false }).pipe(
            tap((data) => {

                //Setear el token
            })
        );
    }

    logout() {

    }


}