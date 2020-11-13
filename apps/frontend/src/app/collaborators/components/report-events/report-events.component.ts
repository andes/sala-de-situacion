import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { environment } from 'apps/frontend/src/environments/environment';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { ReportEventsService } from '../../service/report-events.service';



@Component({
    selector: 'report-events',
    templateUrl: './report-events.component.html'
})
export class ReportEventsComponent implements OnInit {
    public institution;
    public institutions = [];
    public reportEvent;
    public reportFields;
    public tipoReportes = [
        { id: 'adults', nombre: 'Adulto'},
        { id: 'children', nombre: 'Niño'}
    ];
    public tipoReporte = this.tipoReportes[0]; // Por defecto es tipo adulto

    constructor(
        public plex: Plex,
        private institutionService: InstitutionService,
        private reportEventsService: ReportEventsService
    ) { }

    ngOnInit() {
        this.loadInstitutions();
    }

    loadInstitutions() {
        this.institutionService.search({}).subscribe(rtaInstitutions => {
            this.institutions = rtaInstitutions;
        });
    }

    searchReport() {
        if (this.institution && this.tipoReporte) {
            this.reportEventsService.search({ instituciones: [this.institution.id], type: this.tipoReporte.id, sort: '-fecha', limit: 1 }).subscribe(res => {
                this.reportEvent = res[0];
                const report = this.reportEvent.report;
                this.reportFields = Object.keys(report).map(e => ({ label: (environment.TRANSLATIONS[e] ? environment.TRANSLATIONS[e] : e), key: e}));
            });
        } else {
            this.reportEvent = null;
            this.reportFields = null
        }
    }

    submitReport() {
        this.reportEventsService.export(this.reportEvent).subscribe((rta) => {
            this.plex.toast('success', `El reporte se exportó correctamente`);
            this.clear();
        });
    }

    clear() {
        this.reportEvent = null;
        this.reportFields = null
        this.institution = null;
    }
}