import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../service/charts.service';
import { Observable, of } from 'rxjs';
import { InstitutionService } from '../../institutions/service/institution.service';
import { AuthService } from '../../login/services/auth.services';
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
    charts: any;
    chart: any;
    baseURL: any;
    public institutions = [];
    public selectedInstitutions = [];
    public urls = [];
    public title = 'Gráficos de Situación';

    constructor(
        private chartService: ChartsService,
        private institutionService: InstitutionService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.admin = this.auth.checkPermisos('admin:true');
        if (this.admin) {
            this.instituciones$ = this.institutionService
                .search({})
                .pipe(cache());
        } else {
            this.instituciones$ = this.institutionService
                .search({ user: this.auth.user_id, fields: '-permisos' })
                .pipe(cache());
        }
        this.instituciones$.subscribe(rtaInstitutions => {
            this.institutions = rtaInstitutions;
        });
        this.filtrarResultados();
    }

    filtrarResultados() {
        this.institucionesNombres$ = this.instituciones$.pipe(
            map(instituciones => {
                if (this.selectedInstitutions != null && this.selectedInstitutions.length > 0) {
                    let selectedNames = this.selectedInstitutions.map(item => item.nombre);
                    instituciones = instituciones.filter(item => selectedNames.includes(item.nombre));
                }
                return instituciones ? instituciones.map(item => item.nombre) : null;
            })
        );
        this.urls$ = this.institucionesNombres$.pipe(
            switchMap(nombres => {
                return this.chartService.getEmbeddedChart({ activo: true, filter: nombres });
            }),
            map((urls) => {
                return urls;
            }),
            cache());
        this.urls$.subscribe(urls => {
            this.urls = urls;
        });
    }


}
