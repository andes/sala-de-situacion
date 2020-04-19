import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../service/charts.service';
import { Observable, of, combineLatest } from 'rxjs';
import { InstitutionService } from '../../institutions/service/institution.service';
import { AuthService } from '../../login/auth.services';
import { map, tap } from 'rxjs/operators';
import { cache } from '@andes/shared';

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
    public charts$: Observable<any>;

    constructor(
        private chartService: ChartsService,
        private institutionService: InstitutionService,
        private auth: AuthService
    ) {}

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
                instituciones ? instituciones.map(item => item.nombre) : null;
            })
        );

        this.charts$ = this.chartService.search({}).pipe(cache());

        this.urls$ = combineLatest(this.institucionesNombres$, this.charts$).pipe(
            map(([instituciones, charts]) => {
                return charts.map(chart => {
                    const filtros = instituciones ? this.filtroPermisos(chart, instituciones) : '';
                    return `${chart.base_url}/embed/charts?id=${chart.chart_id}&tenant=${chart.tenant}&autorefresh=300&attribution=false&theme=light${filtros}`;
                });
            })
        );
    }

    filtroPermisos(chart, instituciones) {
        if (instituciones.length && chart.filter) {
            let query = {};
            let op = {};
            op[chart.operator] = instituciones;
            query[chart.filter] = op;
            return `&filter=${encodeURI(JSON.stringify(query))}`;
        }
        return '';
    }
}
