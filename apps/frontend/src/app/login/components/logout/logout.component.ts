import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.services';

@Component({
    template: ``
})
export class LogoutComponent implements OnInit {
    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() {
        this.auth.logout(); // Elimina el token de la session
        this.router.navigate(['auth', 'login']).then(() => {
            window.location.reload();
        });
    }
}
