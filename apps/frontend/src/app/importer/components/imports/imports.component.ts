import { Component, OnInit } from '@angular/core';
import { OcupationsService } from '../../services/ocupation.service';
import { ImportsListService } from '../../services/importListService';
import { CheckoutsService } from '../../services/checkout.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { AuthService } from '../../../login/services/auth.services';
import { cache } from '@andes/shared';
import { Plex } from '@andes/plex';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'imports',
    templateUrl: './imports.component.html',
    providers: [ImportsListService]
})
export class ImportsComponent implements OnInit {
    public institutions$: Observable<any>;
    // Filtros
    public fechaDesde$ = this.ocupationsListService.fechaDesde.asObservable();
    public fechaHasta$ = this.ocupationsListService.fechaHasta.asObservable();
    public selectedInstitution;
    public ocupaciones$ = this.ocupationsListService.ocupaciones$;
    public egresos$ = this.ocupationsListService.egresos$;


    constructor(
        public plex: Plex,
        public ocupationsService: OcupationsService,
        public checkoutsService: CheckoutsService,
        private institutionService: InstitutionService,
        private ocupationsListService: ImportsListService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.loadInstitutions();
    }

    loadInstitutions() {
        let search = { fields: '-permisos' };
        if (!this.auth.checkPermisos('admin:true')) {
            search['user'] = this.auth.user_id
        }
        this.institutions$ = this.institutionService
            .search(search)
            .pipe(
                tap((efectores) => {
                    if (efectores.length > 0) {
                        this.selectedInstitution = efectores[0];
                        this.ocupationsListService.setInstitucion(efectores[0]);
                    }
                }),
                map(efectores => {
                    return efectores;
                }),
                cache());
    }

    onChangeDesde($event) {
        const { value } = $event;
        this.ocupationsListService.setDesde(value);
    }

    onChangeHasta($event) {
        const { value } = $event;
        this.ocupationsListService.setHasta(value);
    }

    onChangeInstitucion($event) {
        const { value } = $event;
        this.ocupationsListService.setInstitucion(value);
    }

}
