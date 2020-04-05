import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../login/auth.services';
import { Router } from '@angular/router';

@Component({
    template: ``
})
export class LogoutComponent implements OnInit {
    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() {
        this.auth.logout();
        this.router.navigate(['auth', 'login']).then(() => {
            window.location.reload();
        });
    }
}
