import { Component } from '@angular/core';
import { environment } from './../../environments/environment';
import { Server } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { AuthService } from './../login/auth.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class AppHomeComponent {

  private menuList = [];
  private accessList = [];
  private loggedIn = false;

  constructor(private server: Server, private plex: Plex, private location: Location, private auth: AuthService) {
    this.loggedIn = this.auth.getToken() ? true : false;

    if (this.loggedIn) {
      this.auth.session().subscribe(() => {
        this.crearMenu();
      })
    } else {
      this.crearMenu();
    }
  }
  public crearMenu() {
    this.menuList = [];
    this.menuList.push({ label: 'Página Principal', icon: 'home', route: '/home' });
    this.menuList.push({ label: 'Instituciones', icon: 'hospital-building', route: '/institution/list' });
    if (this.loggedIn && (this.auth.checkPermisos('covid19:event:write')) || this.auth.checkPermisos('admin:true')) {
      this.accessList.push({ label: 'Configuración de eventos', icon: 'cogs', route: '/events' });
    }
    if (this.loggedIn && (this.auth.checkPermisos('covid19:indicators:write')) || this.auth.checkPermisos('admin:true')) {
      this.accessList.push({ label: 'Indicadores salud', icon: 'chart-bar', route: '/ocurrence-events' });
    }
    this.accessList.forEach(element => {
      this.menuList.push(element);
    });
    this.menuList.push({ label: 'Cerrar Sesión', icon: 'logout', route: '/auth/logout' });
    this.plex.updateMenu(this.menuList);
  }

}



