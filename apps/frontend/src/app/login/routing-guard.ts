import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Plex } from '@andes/plex';

@Injectable()
export class RoutingGuard implements CanActivate {
    constructor(private router: Router, private plex: Plex) {}

    canActivate() {
        // this.router.navigate(['/login']);
        return true;
    }
}

@Injectable()
export class RoutingNavBar implements CanActivate {
    constructor(private plex: Plex) {}

    canActivate() {
        this.plex.clearNavbar();
        this.plex.updateTitle('SALA DE SITUACIÓN');
        return true;
    }
}
