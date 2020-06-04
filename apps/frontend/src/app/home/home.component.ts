import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class AppHomeComponent {

    public ayuda = true;

    constructor(public plex: Plex) { }

}



