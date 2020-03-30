import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from '@andes/shared';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
    private authUrl = '/auth'; // URL to web api

    constructor(private server: Server) { }

    create(body): Observable<any> {
        return this.server
            .post(
                this.authUrl + '/create', body
            )
            .pipe(
                tap(data => {
                })
            );
    }

    login(usuario: string, password: string): Observable<any> {
        return this.server.post(this.authUrl + '/login',
            { email: usuario, password: password ? password : '' },
            { params: null, showError: false }
        )
            .pipe(
                tap(data => {
                    //Setear el token
                    this.setToken(data.token);
                })
            );
    }

    activarCuenta(email): Observable<any> {
        return this.server.post(this.authUrl + '/activate',
            { email: email },
            { params: null, showError: false }
        )
            .pipe(
                tap(data => {
                    //Setear el token
                })
            );
    }

    getToken() {
        return window.sessionStorage.getItem('jwt');
    }

    setToken(token: string) {
        window.sessionStorage.setItem('jwt', token);
    }

    logout() {
        localStorage.removeItem('JWT');
    }
}
