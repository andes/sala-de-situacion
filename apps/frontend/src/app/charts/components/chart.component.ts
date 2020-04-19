import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../service/charts.service';
import { Observable, of, combineLatest } from 'rxjs';
import { InstitutionService } from '../../institutions/service/institution.service';
import { AuthService } from '../../login/auth.services';
import { map, switchMap } from 'rxjs/operators';
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
        this.charts$ = this.chartService.search({ activo: true }).pipe(cache());
        this.urls$ = this.institucionesNombres$.pipe(
            switchMap(nombres => {
                return this.chartService.getEmbeddedChart({ activo: true, filter: nombres });
            }),
            map((urls) => {
                return urls;
            }),
            cache());
    }


}
