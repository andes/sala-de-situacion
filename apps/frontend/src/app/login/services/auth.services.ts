import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Server } from '@andes/shared';
import { tap, switchMap, catchError, publishReplay, refCount } from 'rxjs/operators';
const shiroTrie = require('shiro-trie');
import { cache } from '@andes/shared';

@Injectable()
export class AuthService {
    private authUrl = '/auth'; // URL to web api auth
    public showPassword = false;
    public eye: 'eye' | 'eye-off' = 'eye'; // mostrar/ocultar password
    public passwordTooltip: 'mostrar contraseña' | 'ocultar contraseña' = 'mostrar contraseña';
    public session$: Observable<any>;
    public user_id: any;
    public nombre: any;
    public apellido: any;
    private shiro = shiroTrie.new();
    private permisos: string[];
    public token$ = new Subject<any>();

    constructor(private server: Server) {
        this.session$ = this.token$.pipe(
            switchMap(() => {
                return this.server.get(`${this.authUrl}/session`);
            }),
            tap(payload => {
                this.user_id = payload.id;
                this.nombre = payload.nombre;
                this.apellido = payload.apellido;
                this.permisos = payload.permisos;
                this.initShiro();
            }),
            cache()
        );
    }

    private initShiro() {
        this.shiro.reset();
        this.shiro.add(this.permisos);
    }

    create(body): Observable<any> {
        return this.server.post(this.authUrl + '/create', body, { showError: false });
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
        return this.server.post(`${this.authUrl}/resetPassword`, body);
    }

    setNewValidationToken(email): Observable<any> {
        return this.server.post(`${this.authUrl}/regenerate/${email}`, { showError: false })
    }

    getPermissions(string: string): string[] {
        return this.shiro.permissions(string);
    }

    getToken() {
        return window.sessionStorage.getItem('jwt');
    }

    getSession() {
        return this.session$;
    }

    setToken(token: string) {
        window.sessionStorage.setItem('jwt', token);
        this.token$.next(token);
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

    sugerencias(body): Observable<any> {
        return this.server.post(this.authUrl + `/sugerencias`, body, { showError: false });
    }
}
