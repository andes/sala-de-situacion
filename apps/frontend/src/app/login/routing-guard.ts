import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Plex } from '@andes/plex';
import { AuthService } from './services/auth.services';
import { map, take } from 'rxjs/operators';

@Injectable()
export class RoutingGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate() {
        const token = this.auth.getToken();
        if (!token) {
            return this.router.navigate(['auth', 'login']);
        } else {
            return this.auth.getSession().pipe(map(() => {
                return true;
            }));
        }
    }
}

@Injectable()
export class RoutingNavBar implements CanActivate {
    constructor(private plex: Plex) { }

    canActivate() {
        this.plex.clearNavbar();
        this.plex.updateTitle('SALA DE SITUACIÓN');
        return true;
    }
}
