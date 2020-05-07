import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartsService } from '../service/charts.service';
import { Observable, of, combineLatest } from 'rxjs';
import { InstitutionService } from '../../institutions/service/institution.service';
import { AuthService } from '../../login/services/auth.services';
import { map, switchMap } from 'rxjs/operators';
import { cache } from '@andes/shared';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class AppChartComponent implements OnInit {
    public urls$: Observable<any>;
    public instituciones$: Observable<any>;
    private admin: Boolean;
    public institucionesNombres$: Observable<any>;
    charts: any;
    chart: any;
    baseURL: any;

    constructor(
        private chartService: ChartsService,
        private institutionService: InstitutionService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.admin = this.auth.checkPermisos('admin:true');
        if (this.admin) {
            this.instituciones$ = of(null);
        } else {
            this.instituciones$ = this.institutionService
                .search({ user: this.auth.user_id, fields: '-permisos' })
                .pipe(cache());
        }
        this.institucionesNombres$ = this.instituciones$.pipe(
            map(instituciones => {
                return instituciones ? instituciones.map(item => item.nombre) : null;
            })
        );
        this.urls$ = this.institucionesNombres$.pipe(
            switchMap(nombres => {
                return this.chartService.getEmbeddedChart({ activo: true, filter: nombres });
            }),
            map((urls) => {
                this.charts = urls[0].split('&');
                this.baseURL = urls[0].split('?')[0];
                const splitted = { [urls[0].split('&')[0].split('?')[1].split('=')[0]]: urls[0].split('&')[0].split('?')[1].split('=')[1] };
                this.charts = this.charts.map(y => ({ [y.split('=')[0]]: y.split('=')[1] }));
                this.charts[0] = splitted;

                console.log(this.charts);
                console.log(this.baseURL);

                // this.initChart();
                return urls;
            }),
            cache());
    }

    ngAfterViewInit(): void {


        // this.chartService.search({}).subscribe(charts => {
        //     this.urls = charts.map(chart => {
        //         return `${chart.base_url}/embed/charts?id=${chart.chart_id}&tenant=${chart.tenant}&autorefresh=300&attribution=false&theme=light`;
        //     });
        //     this.charts = charts.map(chart => {
        //         return {
        //             id: chart.chart_id,
        //             base_url: chart.base_url,
        //             tenant: chart.tenant
        //         };
        //     });
        // });

    }


    initChart() {
        const sdk = new ChartsEmbedSDK({
            // baseUrl: 'https://charts.mongodb.com/charts-charts-fixture-tenant-zdvkh',
            baseUrl: this.baseURL,
            // baseUrl: 'http://172.16.1.63/mongodb-charts-zypoq'
        });
        this.chart = sdk.createChart({
            chartId: this.charts[0].id,
            // chartId: '48043c78-f1d9-42ab-a2e1-f2d3c088f864',
            showAttribution: false,
            theme: 'light',
            filter: this.charts[0].filter,
            signature: this.charts[0].signature,
            // timestamp: this.charts[0].timestamp,
            // tenant: this.charts[0].tenant,
        });

        this.chart
        this.renderChart();
    }

    renderChart() {
        // render the chart into a container
        this.chart
            .render(document.getElementById('chart'))
            .catch(() => window.alert('Chart failed to initialise'));
    }

    refreshChart() {
        // refresh the chart whenenver #refreshButton is clicked
        this.chart.refresh();
    }


}
