import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from '@andes/shared';
import { tap } from 'rxjs/operators';
import { IUsuario } from './components/user/IUsuario.interfaces';

@Injectable()
export class AuthService {
    public user: IUsuario;
    private authUrl = '/auth'; // URL to web api
    private userUrl = '/users'; // URL to web api

    constructor(private server: Server) { }

    create(body): Observable<any> {
        return this.server.post(this.authUrl + '/create', body);
    }

    update(body): Observable<any> {
        return this.server.patch(this.userUrl + `/${body.id}`, body);
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
        return this.server.post(`/auth/validate/${token}`, { params: null, showError: false }).pipe(
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

    getUser() {
        let token = this.getToken();
        return this.server.get(`/auth/usuario/${token}`, { params: null, showError: false }).pipe(
            tap(user => {
                this.user = user;
            })
        );;
    }

    logout() {
        localStorage.removeItem('JWT');
        this.user = null;
    }
}
