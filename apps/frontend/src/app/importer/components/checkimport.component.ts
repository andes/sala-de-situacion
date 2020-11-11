import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { cache } from '@andes/shared';
import { Observable } from 'rxjs';
import { InstitutionService } from '../../institutions/service/institution.service';
import { AuthService } from '../../login/services/auth.services';
import { OcupationsService } from '../services/ocupation.service';

@Component({
    selector: 'checkimport',
    templateUrl: './checkimport.component.html'
})
export class CheckImportComponent implements OnInit {
    public institutions$: Observable<any>;
    public ocupaciones$: Observable<any>;
    public archivos = [];
    public selectedInstitution;
    public selectedFile;

    constructor(
        public plex: Plex,
        private institutionService: InstitutionService,
        private auth: AuthService,
        public ocupationsService: OcupationsService
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
            .pipe(cache());
    }

    onChangeInstitucion($event) {
        const { value } = $event;
        // busca los archivos de la institución
        if (value.id) {
            this.ocupaciones$ = this.ocupationsService
                .search({ institution: value.id, exportado: false, sort: '-nroArchivo', limit: '1' })
                .pipe(cache());

        } else {
            this.selectedFile = null;
        }
    }

    exportarArchivo() {
        if (this.selectedFile && this.selectedFile.nroArchivo !== null) {
            this.ocupationsService.export(this.selectedFile.nroArchivo).subscribe();
        }
    }

}
