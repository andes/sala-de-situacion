import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { AuthService } from './login/auth.services';

@Component({
    selector: 'sala-de-situacion-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private menuList = [];
    private accessList = [];

    constructor(private server: Server, private plex: Plex, private location: Location, private auth: AuthService) {
        this.server.setBaseURL(environment.API);
        this.plex.updateTitle('SALA DE SITUACIÓN');
        this.auth.getSession().subscribe(() => {
            this.crearMenu();
        })
    }

    ngOnInit() {
        const token = this.auth.getToken();

        if (token) {
            this.auth.setToken(token);
        }
    }

    back() {
        this.location.back();
    }

    public crearMenu() {
        this.menuList = [];
        this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
        this.menuList.push({ label: 'Instituciones', icon: 'hospital-building', route: '/institution/list' });
        if ((this.auth.checkPermisos('covid19:event:write')) || this.auth.checkPermisos('admin:true')) {
            this.accessList.push({ label: 'Configuración de eventos', icon: 'cogs', route: '/events' });
        }
        if ((this.auth.checkPermisos('covid19:indicators:write')) || this.auth.checkPermisos('admin:true')) {
            this.accessList.push({ label: 'Indicadores salud', icon: 'chart-bar', route: '/ocurrence-events' });
        }
        if ((this.auth.checkPermisos('covid19:indicators:write')) || this.auth.checkPermisos('admin:true')) {
            this.accessList.push({ label: 'Dashboards', icon: 'chart-pie', route: '/chart/dashboard' });
        }
        this.accessList.forEach(element => {
            this.menuList.push(element);
        });
        this.menuList.push({ label: 'Mi Perfil', icon: 'account-circle', route: '/auth/user-profile' });
        this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/auth/logout' });
        this.plex.updateMenu(this.menuList);
    }
}
