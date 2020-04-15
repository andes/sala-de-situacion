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

    constructor(private server: Server, private plex: Plex, private location: Location) {
        this.server.setBaseURL(environment.API);
        this.plex.updateTitle('SALA DE SITUACIÓN');
    }

    back() {
        this.location.back();
    }
}
