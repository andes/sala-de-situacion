import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../login/auth.services';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {

    institutions: any = [{ "activo": true, "_id": "5e97532aca549149abbba241", "nombre": "CLINICA PASTEUR", "email": "pasteur@pasteur.com", "telefono": "2990000000", "direccion": "av siempreviva 123", "localidad": "Neuquén", "provincia": "Neuquén", "users": [{ "permisos": ["covid19:indicators:write"], "_id": "5e887b38294bcf12ae6ef93d", "documento": "29410428", "nombre": "Carolina", "apellido": "Celeste" }], "createdAt": "2020-04-15T18:32:10.724Z", "createdBy": { "email": "celeste.carolina.s@gmail.com", "nombre": "Carolina", "apellido": "Celeste", "documento": "29410428" }, "barrio": "", "updatedAt": "2020-04-20T16:53:15.113Z", "updatedBy": { "email": "celeste.carolina.s@gmail.com", "nombre": "Carolina", "apellido": "Celeste", "documento": "29410428", "organizacion": null }, "coordenadas": [-38.9642578, -68.0445886], "id": "5e97532aca549149abbba241" }, { "activo": true, "_id": "5e97beef7a4d190b21fddc20", "nombre": "CLINICA ADOS", "email": "ados@ados.com", "telefono": "", "direccion": "Tucumán 436", "localidad": "Neuquén", "provincia": "Neuquén", "users": [{ "permisos": [], "_id": "5e9c8d89dc9448497aea4721", "documento": "30093263", "nombre": "Silvina", "apellido": "Roa" }], "createdAt": "2020-04-16T02:11:59.705Z", "createdBy": { "email": "celeste.carolina.s@gmail.com", "nombre": "Carolina", "apellido": "Celeste", "documento": "29410428" }, "barrio": "", "updatedAt": "2020-04-18T12:35:57.055Z", "updatedBy": { "email": "andresin@gmail.com", "nombre": "ANDRÉS", "apellido": "BOC-HO", "documento": "29148200", "organizacion": null }, "coordenadas": [-38.9504124, -68.0521847], "id": "5e97beef7a4d190b21fddc20" }];

    showModalResetPassword = false;
    showUsarios = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    usuario: any = {};
    token = '';

    ngOnInit(): void { }

    reset() {
        this.showModalResetPassword = true;
    }

    close(event) {
        this.showModalResetPassword = false;
    }
}
