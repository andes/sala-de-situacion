import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';

@Component({
    selector: 'sala-de-situacion-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private menuList = [];

    constructor(public server: Server, public plex: Plex) {
        server.setBaseURL(environment.API);

        this.plex.updateTitle('SALA DE SITUACIÓN');
        this.crearMenu();
    }

    public crearMenu() {
        this.menuList = [];
        this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
        this.menuList.push({ label: 'Alta de institución', icon: 'hospital-building', route: '/institution' });
        this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login/logout' });
        this.plex.updateMenu(this.menuList);
    }
}
