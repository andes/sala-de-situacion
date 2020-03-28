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
                    //Setear el token
                })
            );
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
                })
            );
    }

    logout() { }
}
