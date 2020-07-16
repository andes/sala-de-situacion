import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import * as moment from 'moment';
import { OcupationsService, Ocupation } from '../../services/ocupation.service';
import { CheckoutsService, Checkout } from '../../services/checkout.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { cache } from '@andes/shared';
import { Observable } from 'rxjs';

@Component({
    selector: 'imports',
    templateUrl: './imports.component.html'
})
export class ImportsComponent implements OnInit {
    egresos$: Observable<Checkout[]>;
    public egresos = [];
    ocupaciones$: Observable<Ocupation[]>;
    public ocupaciones = [];
    public institutions = [];
    // Filtros
    public fechaDesde;
    public fechaHasta;
    public selectedInstitution;

    constructor(
        public plex: Plex,
        public ocupationsService: OcupationsService,
        public checkoutsService: CheckoutsService,
        private institutionService: InstitutionService
    ) { }

    ngOnInit() {
        this.ocupaciones$ = this.ocupationsService.search({ sort: 'createdAt' }).pipe(cache());
        this.egresos$ = this.checkoutsService.search({ sort: 'createdAt' }).pipe(cache());
        this.loadInstitutions();
    }

    loadInstitutions() {
        this.institutionService.search({}).subscribe(rtaInstitutions => {
            //toma la primer institucion del usuario
            this.institutions = rtaInstitutions;
            this.selectedInstitution = rtaInstitutions[0];
            this.fechaDesde = new Date();
            this.fechaHasta = new Date();
            this.filtrarResultados();
        });
    }

    filtrarResultados() {
        this.ocupaciones$.subscribe(ocupaciones => {
            if (this.selectedInstitution) {
                ocupaciones = ocupaciones.filter(e => e.institution && e.institution.id === this.selectedInstitution.id);
                if (this.fechaDesde) {
                    ocupaciones = ocupaciones.filter(
                        e =>
                            e.createdAt >=
                            moment(this.fechaDesde)
                                .startOf('day')
                                .toDate()
                    );
                }
                if (this.fechaHasta) {
                    ocupaciones = ocupaciones.filter(
                        e =>
                            e.createdAt <=
                            moment(this.fechaHasta)
                                .endOf('day')
                                .toDate()
                    );
                }
                this.ocupaciones = ocupaciones;
            } else {
                this.ocupaciones = [];
            }
        });
        this.egresos$.subscribe(egresos => {
            if (this.selectedInstitution) {
                egresos = egresos.filter(e => e.institution && e.institution.id === this.selectedInstitution.id);
                if (this.fechaDesde) {
                    egresos = egresos.filter(
                        e =>
                            e.createdAt >=
                            moment(this.fechaDesde)
                                .startOf('day')
                                .toDate()
                    );
                }
                if (this.fechaHasta) {
                    egresos = egresos.filter(
                        e =>
                            e.createdAt <=
                            moment(this.fechaHasta)
                                .endOf('day')
                                .toDate()
                    );
                }
                this.egresos = egresos;
            } else {
                this.egresos = [];
            }
        });
    }
}
