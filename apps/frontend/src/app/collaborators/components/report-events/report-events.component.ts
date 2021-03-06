import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { ReportEventsService } from '../../service/report-events.service';
import { Observable, of } from 'rxjs';
import { OcupationsService } from '../../../importer/services/ocupation.service';
import { cache } from '@andes/shared';
import { debug } from 'util';


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
        { id: 'adults', nombre: 'Adulto' },
        { id: 'children', nombre: 'Niño' }
    ];
    public opciones = [
        { id: 1, label: 'Exportar a Nación' },
        { id: 2, label: 'Exportar Archivos' }
    ];
    public tipoExportacion = 1;
    public tipoReporte = null;
    public ocupaciones$: Observable<any>;
    private TRANSLATIONS = {
        respirators_allocated_adult: 'Dotación de respiradores',
        respirators_available_adult_count: 'Cantidad de respiradores disponibles',
        respirators_unavailable_adult_count: 'Cantidad de respiradores ocupados',
        uti_allocated_adult: 'Dotación de camas',
        uti_allocated_adult_gas: 'Dotación de camas con oxígeno',
        uti_discharged_adult_count: 'Egresos por alta médica',
        uti_discharged_dead_adult_count: 'Egresos por deceso ',
        uti_discharged_derivative_adult_count: 'Egresos por derivación',
        uti_gas_available_adult_count: 'Cantidad de camas con oxígeno disponible',
        uti_gas_unavailable_adult_count: 'Cantidad de camas con oxígeno ocupadas',
        uti_hospitalized_adult_count: 'Total internados',
        respirators_allocated_children: 'Dotación de respiradores',
        respirators_available_children_count: 'Cantidad de respiradores disponibles',
        respirators_unavailable_children_count: 'Cantidad de respiradores ocupados',
        uti_allocated_children: 'Dotación de camas',
        uti_allocated_children_gas: 'Dotación de camas con oxígeno',
        uti_discharged_children_count: 'Egresos por alta médica',
        uti_discharged_dead_children_count: 'Egresos por deceso ',
        uti_discharged_derivative_children_count: 'Egresos por derivación',
        uti_gas_available_children_count: 'Cantidad de camas con oxígeno disponible',
        uti_gas_unavailable_children_count: 'Cantidad de camas con Oxígeno ocupadas',
        uti_hospitalized_children_count: 'Total internados',
    };

    constructor(
        public plex: Plex,
        private institutionService: InstitutionService,
        private reportEventsService: ReportEventsService,
        public ocupationsService: OcupationsService
    ) { }

    ngOnInit() {
        this.loadInstitutions();
        this.ocupaciones$ = of([]);
    }

    loadInstitutions() {
        this.institutionService.search({ activo: true }).subscribe(rtaInstitutions => {
            this.institutions = rtaInstitutions;
        });
    }

    searchReport() {
        if (this.institution && this.tipoReporte) {
            this.reportEventsService.search({ instituciones: [this.institution.id], type: this.tipoReporte.id, sort: '-fecha', limit: 1 }).subscribe(res => {
                this.reportEvent = res[0];
                if (this.reportEvent && this.reportEvent.report) {
                    const report = this.reportEvent.report;
                    this.reportFields = Object.keys(report).map(e => ({ label: (this.TRANSLATIONS[e] ? this.TRANSLATIONS[e] : e), key: e }));

                }
            });
        } else {
            if (this.institution && this.tipoExportacion == 2) {
                this.ocupaciones$ = this.ocupationsService
                    .search({ institution: this.institution.id, exportado: false, sort: '-nroArchivo', limit: '1' })
                    .pipe(cache());

            } else {
                this.reportEvent = null;
                this.reportFields = null;
                this.ocupaciones$ = of([]);
            }
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

    exportarArchivo(ocupacion) {
        if (ocupacion.nroArchivo !== null) {
            this.ocupationsService.export(ocupacion.nroArchivo).subscribe();
        }
    }

}