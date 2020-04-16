import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class AppChartComponent implements OnInit {
    public url = "";
    public urlTable = "";

    ngOnInit() {
        const chartDona = 'e2800c81-cc72-41c6-a7e7-07dc80acf2a2';
        const tenant = 'a9672a8c-ba22-4076-9434-24ca28422f56';
        const chartTable = '6e392422-fa18-4e68-bd7d-e8e307fe11e0';
        this.url = `${environment.charts_embedding_base_url}/embed/charts?id=${chartDona}&tenant=${tenant}&autorefresh=300&attribution=false&theme=light`;
        this.urlTable = `${environment.charts_embedding_base_url}/embed/charts?id=${chartTable}&tenant=${tenant}&autorefresh=300&attribution=false&theme=light`;
    }
}