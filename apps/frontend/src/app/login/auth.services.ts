import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from '@andes/shared';
import { tap, publishReplay, refCount } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";
const shiroTrie = require('shiro-trie');

@Injectable()
export class AuthService {
    private authUrl = '/auth'; // URL to web api auth
    private authUsers = '/users'; // URL to web api users
    public showPassword = false;
    public eye: 'eye' | 'eye-off' = 'eye'; // mostrar/ocultar password
    public passwordTooltip: 'mostrar contraseña' | 'ocultar contraseña' = 'mostrar contraseña';
    public session$: Observable<any>;
    public nombre: any;
    public apellido: any;
    private shiro = shiroTrie.new();
    private permisos: string[];

    constructor(private server: Server) { }

    private initShiro() {
        this.shiro.reset();
        this.shiro.add(this.permisos);
    }

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

    getPermissions(string: string): string[] {
        return this.shiro.permissions(string);
    }

    session(force = false) {
        if (!this.session$ || force) {
            const token = this.getToken();
            if (token) {
                const id = jwt_decode(token).user_id;
                this.session$ = this.server.get(`${this.authUsers}/${id}?fields=nombre&fields=apellido&fields=permisos&fields=active`).pipe(
                    tap((payload) => {
                        this.nombre = payload.nombre;
                        this.apellido = payload.apellido;
                        this.permisos = payload.permisos;
                        this.initShiro()
                    }),
                    publishReplay(1),
                    refCount()
                );
            }

        }
        return this.session$;
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

    checkPermisos(permiso: string) {
        return this.shiro.check(permiso);
    }


}
