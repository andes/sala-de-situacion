import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';

@Component({
    selector: 'sala-de-situacion-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private menuList = [];

    constructor(public server: Server, public plex: Plex, public auth: Auth) {
        server.setBaseURL(environment.API);

        this.plex.updateTitle('SALA DE SITUACIÓN');
        const token = this.auth.getToken();
        if (token) {
            this.auth.session().subscribe(() => {
                this.crearMenu();
            });
        }
    }

    public crearMenu() {
        this.menuList = [];
        this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
        this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/login/logout' });
        this.plex.updateMenu(this.menuList);
    }
}
