import { Component, AfterViewInit } from '@angular/core';
import { environment } from 'apps/frontend/src/environments/environment';

@Component({
    selector: 'epidemiologia',
    templateUrl: './epidemiologia.component.html'
})

export class EpidemiologiaComponent implements AfterViewInit {
    public url;
    dashboard: string;

    ngAfterViewInit(): void {
        this.dashboard = 'd/55L74SeZz/sala-de-situacion-coronavirus-neuquen?orgId=1';
        this.url = `${environment.GRAFANA}${this.dashboard}`;

    }

}