import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from '@andes/shared';
import { tap } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";
const shiroTrie = require('shiro-trie');

@Injectable()
export class AuthService {
    private authUrl = '/auth'; // URL to web api
    public showPassword = false;
    public eye: 'eye' | 'eye-off' = 'eye'; // mostrar/ocultar password
    public passwordTooltip: 'mostrar contraseña' | 'ocultar contraseña' = 'mostrar contraseña';

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

    getPermisosUsuario(): Observable<any> {
        const t = this.getToken();
        const id = jwt_decode(t).user_id;
        return this.server.get(`${this.authUrl}/usuario/?id=${id}`);
    }

    getToken() {
        return window.sessionStorage.getItem('jwt');
    }

    setToken(token: string) {
        window.sessionStorage.setItem('jwt', token);
    }

    logout() {
        window.sessionStorage.removeItem('jwt');
    }

    toggleEye() {
        if (!this.showPassword) {
            this.eye = 'eye-off';
            this.passwordTooltip = 'ocultar contraseña';
        } else {
            this.eye = 'eye';
            this.passwordTooltip = 'mostrar contraseña';
        }
        this.showPassword = !this.showPassword;
    }

    checkPermisos(listaPermisos, permiso) {
        const shiro = shiroTrie.new();
        shiro.add(listaPermisos);
        return shiro.check(permiso);
    }


}
