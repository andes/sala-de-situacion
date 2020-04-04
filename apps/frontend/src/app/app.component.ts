import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';

@Component({
    selector: 'sala-de-situacion-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private menuList = [];

    constructor(private server: Server, private plex: Plex, private location: Location) {
        this.server.setBaseURL(environment.API);

        this.plex.updateTitle('SALA DE SITUACIÓN');
        this.crearMenu();
    }

    public crearMenu() {
        this.menuList = [];
        this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
        this.menuList.push({ label: 'Instituciones', icon: 'hospital-building', route: '/institution/list' });
        this.menuList.push({ label: 'Eventos', icon: 'application', route: '/events' });
        this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login/logout' });
        this.plex.updateMenu(this.menuList);
    }

    back() {
        this.location.back();
    }
}
