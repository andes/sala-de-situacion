import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../service/charts.service';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class AppChartComponent implements OnInit {
    public urls: any;
    constructor(private chartService: ChartsService) {}

    ngOnInit() {
        this.chartService.search({}).subscribe(charts => {
            this.urls = charts.map(chart => {
                return `${chart.base_url}/embed/charts?id=${chart.chart_id}&tenant=${chart.tenant}&autorefresh=300&attribution=false&theme=light`;
            });
        });
    }
}
