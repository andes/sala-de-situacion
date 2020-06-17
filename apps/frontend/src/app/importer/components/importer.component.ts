import { CheckoutsService } from './../services/checkout.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../login/services/auth.services';
import { Plex } from '@andes/plex';
import { OcupationsService } from '../services/ocupation.service';
import { InstitutionService } from '../../institutions/service/institution.service';
import * as moment from 'moment';

@Component({
    selector: 'chart',
    templateUrl: './importer.component.html'
})
export class ImporterComponent implements OnInit {
    @ViewChild('inputFile', null) inputFile;

    public egresos = [];
    public ingresos = [];
    public disableGuardar = true;
    private user;
    public institution = {};
    public institutions = [];
    public tiposEgresosValidos = ['ALTA', 'DEFUNCION', 'DERIVACION', 'RETIRO VOLUNTARIO'];
    public estadosValidos = ['DISPONIBLE', 'OCUPADA', 'BLOQUEADA'];

    constructor(
        private auth: AuthService,
        public plex: Plex,
        public ocupationsService: OcupationsService,
        public checkoutsService: CheckoutsService,
        private institutionService: InstitutionService
    ) { }

    ngOnInit() {
        this.auth.getSession().subscribe((sessionUser) => {
            this.user = sessionUser;
            this.loadInstitutions();
        });
    }

    public changeListenerIngresos(files: FileList) {
        this.disableGuardar = true;
        if (files && files.length > 0) {
            let file: File = files.item(0);
            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv = reader.result;
                var result = this.csvParseIngresos(csv);
                this.ingresos = result;
                if (this.ingresos.length > 0 || this.egresos.length > 0)
                    this.disableGuardar = false;
            }
        }
    }

    public changeListenerEgresos(files: FileList) {
        this.disableGuardar = true;
        if (files && files.length > 0) {
            let file: File = files.item(0);
            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv = reader.result;
                var result = this.csvParseEgresos(csv);
                this.egresos = result;
                if ((this.ingresos && this.ingresos.length > 0) || (this.egresos && this.egresos.length > 0)) {
                    this.disableGuardar = false;
                }
            }
        }
    }

    public csvParseIngresos(csv) {
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length - 1; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                if (currentline[j]) {
                    currentline[j] = currentline[j].replace(/['"]+/g, '').toUpperCase();
                }
                if (headers[j]) {
                    headers[j] = headers[j].replace(/['" ]+/g, '');
                }
                if (!(headers[j].toLowerCase() === 'estado' && !this.estadosValidos.includes(currentline[j]))) {
                    obj[headers[j].toLowerCase()] = currentline[j];
                }
            }
            result.push(obj);
        }
        return result;
    }

    public csvParseEgresos(csv) {
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length - 1; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                if (currentline[j]) {
                    currentline[j] = currentline[j].replace(/['"]+/g, '').toUpperCase();
                }
                if (headers[j]) {
                    headers[j] = headers[j].replace(/['" ]+/g, '');
                }
                if (!(headers[j].toLowerCase() === 'tipo de egreso') || headers[j].toLowerCase() === 'tipo de egreso' && this.tiposEgresosValidos.includes(currentline[j])) {
                    obj[headers[j].toLowerCase()] = currentline[j];
                }
            }
            result.push(obj);
        }
        return result;
    }

    guardarImportacion() {
        try {
            this.ingresos.forEach(element => {
                this.guardarIngreso(element);
            });
            this.ingresos = [];
            this.egresos.forEach(element => {
                this.guardarEgreso(element);
            });
            this.egresos = [];
            this.resetInput();
            this.plex.toast('success', `Los datos han sido importados correctamente`);
        } catch (err) {
            this.plex.info('danger', 'Error al importar los datos');
        }
    }

    guardarIngreso(dataIngreso) {
        let ingreso = {
            nombre: dataIngreso.nombre,
            apellido: dataIngreso.apellido,
            fechaIngreso: moment(dataIngreso.fechadeingreso, 'DD/MM/YYYY').toDate(),
            horaIngreso: dataIngreso.horadeingreso,
            dni: dataIngreso.dni,
            habitacion: dataIngreso.habitacion,
            piso: dataIngreso.piso,
            servicio: dataIngreso.servicio,
            cama: dataIngreso.cama,
            respirador: dataIngreso.respirador,
            covid: dataIngreso.covid,
            oxigeno: dataIngreso.oxigeno,
            estado: dataIngreso.estado,
            institution: this.institution,
            exportado: false
        };
        this.ocupationsService.save(ingreso).subscribe();
    }

    guardarEgreso(dataEgreso) {
        let egreso = {
            nombre: dataEgreso.nombre,
            apellido: dataEgreso.apellido,
            fechaIngreso: moment(dataEgreso.fechadeingreso, 'DD/MM/YYYY').toDate(),
            horaIngreso: dataEgreso.horadeingreso,
            dni: dataEgreso.dni,
            fechaEgreso: moment(dataEgreso.fechadeegreso, 'DD/MM/YYYY').toDate(),
            horaEgreso: dataEgreso.horadeegreso,
            tipo: dataEgreso.tipodeegreso,
            institution: this.institution,
            exportado: false
        };
        this.checkoutsService.save(egreso).subscribe();
    }

    resetInput() {
        this.inputFile.nativeElement.value = '';
    }

    loadInstitutions() {
        this.institutionService.search({}).subscribe(rtaInstitutions => {
            //toma la primer institucion del usuario
            this.institutions = rtaInstitutions;
            this.institution = rtaInstitutions[0];
        });
    }
}
