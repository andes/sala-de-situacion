import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from '@andes/shared';
import { tap, publishReplay, refCount } from 'rxjs/operators';

@Injectable()
export class AuthService {
    private authUrl = '/auth'; // URL to web api
    private session$: Observable<any>;
    public usuario;
    private permisos;

    constructor(private server: Server) { }

    create(body): Observable<any> {
        return this.server.post(this.authUrl + '/create', body);
    }

    login(usuario: string, password: string): Observable<any> {
        return this.server
            .post(
                this.authUrl + '/login',
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

    activarCuenta(token): Observable<any> {
        return this.server.post(`${this.authUrl}/validate/${token}`, { params: null, showError: false }).pipe(
            tap(data => {
                //Setear el token
            })
        );
    }


    resetPassword(body): Observable<any> {
        return this.server.post(`${this.authUrl}/resetPassword`, body)
    }

    setNewValidationToken(email): Observable<any> {
        return this.server.post(`${this.authUrl}/regenerate/${email}`, { params: null, showError: false }).pipe(
            tap(data => {
                // ver
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

    session(force = false) {
        if (!this.session$ || force) {
            this.session$ = this.server.get('/auth/sesion').pipe(
                tap(payload => {
                    this.usuario = payload.usuario;
                    this.permisos = payload.permisos;
                }),
                publishReplay(1),
                refCount()
            );
        }
        return this.session$;
    }
}
