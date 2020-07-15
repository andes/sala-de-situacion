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
    public ultimoNroArchivoIngreso: number;
    public ultimoNroArchivoEgreso: number;
    public institution = {};
    public institutions = [];
    public verAyuda = false;
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
            this.loadInstitutions();
            this.getUltimoNumeroArchivoIngreso();
            this.getUltimoNumeroArchivoEgreso();
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
            }
        }
    }

    private comprobarOcupacion(ocupacion, linea) {
        let mensaje = "";

        if (Object.keys(ocupacion).length != 13) {
            mensaje += `La cantidad de campos obtenidos no corresponde. (linea ${linea}).`;
        }
        if (!ocupacion.cama) {
            mensaje += `Debe completar el dato cama. (linea ${linea}). `;
        }
        if (!ocupacion.estado) {
            mensaje += `Debe completar el dato estado. (linea ${linea}). `;
        } else {
            if (ocupacion.estado === 'OCUPADA') {
                if (!ocupacion.nombre && !ocupacion.apellido && !ocupacion.dni) {
                    mensaje += `Debe completar al menos un dato de paciente. (linea ${linea}). `;
                }
            }
        }
        return mensaje;
    }

    private comprobarEgresos(egreso, linea) {
        let mensaje = "";

        if (Object.keys(egreso).length != 8) {
            mensaje += `La cantidad de campos obtenidos no corresponde. (linea ${linea}).`;
        }
        if (!egreso.tipodeegreso) {
            mensaje += `Debe completar el tipo de egreso. (linea ${linea}). `;
        }

        if (!egreso.fechadeegreso) {
            mensaje += `Debe completar la fecha de egreso. (linea ${linea}). `;
        }

        if (!egreso.fechadeingreso) {
            mensaje += `Debe completar la fecha de egreso. (linea ${linea}). `;
        }

        if (!egreso.nombre && !egreso.apellido && !egreso.dni) {
            mensaje += `Debe completar al menos un dato de paciente. (linea ${linea}). `;
        }
        return mensaje;
    }

    public csvParseIngresos(csv) {
        let lines = csv.split("\n");
        let result = [];
        let inicio = 0;
        let headers = ['fechadeingreso', 'horadeingreso', 'dni', 'apellido', 'nombre', 'piso', 'habitacion', 'servicio', 'cama', 'oxigeno', 'respirador', 'covid', 'estado'];
        if (lines[0].toLowerCase().includes("fecha")) {
            inicio = 1;
            headers = lines[0].split(/[;,]+/);
            headers = headers.map(h => h.replace(/['" ]+/g, '').toLowerCase().trim());
            headers = headers.map(h => {
                h = h === 'fechaingreso' ? 'fechadeingreso' : h;
                h = h === 'horaingreso' ? 'horadeingreso' : h;
                return h;
            });
        }
        for (let i = inicio; i < lines.length - 1; i++) {
            let obj = {};
            let currentline = lines[i].split(/(?=[;,])/);
            for (let j = 0; j < headers.length; j++) {
                if (currentline[j]) {
                    currentline[j] = currentline[j].replace(/['";,]+/g, '').toUpperCase().trim();
                }
                if (!(headers[j] === 'estado' && !this.estadosValidos.includes(currentline[j]))) {
                    obj[headers[j]] = currentline[j];
                }
            }
            let mensaje = '';
            if (mensaje = this.comprobarOcupacion(obj, i)) {
                this.disableGuardar = true;
                this.plex.info('danger', `Archivo ocupaciones: ${mensaje}`);
                this.resetInput();
                return [];
            } else {
                this.disableGuardar = false;
                result.push(obj);
            }

        }
        return result;
    }

    public csvParseEgresos(csv) {
        let lines = csv.split("\n");
        let result = [];
        let inicio = 0;
        let headers = ['fechadeingreso', 'horadeingreso', 'dni', 'apellido', 'nombre', 'fechadeegreso', 'horadeegreso', 'tipodeegreso'];
        if (lines[0].toLowerCase().includes("fecha")) {
            inicio = 1;
            headers = lines[0].split(/[;,]+/);
            headers = headers.map(h => h.replace(/['" ]+/g, '').toLowerCase().trim());
            headers = headers.map(h => {
                h = h === "fechaingreso" ? 'fechadeingreso' : h;
                h = h === "horaingreso" ? 'horadeingreso' : h;
                h = h === "fechaegreso" ? 'fechadeegreso' : h;
                h = h === "horadeegreso" ? 'horadeegreso' : h;
                h = h === "tipoegreso" ? 'tipodeegreso' : h;
                return h;
            });
        }
        for (let i = inicio; i < lines.length - 1; i++) {
            let obj = {};
            let currentline = lines[i].split(/[;,]+/);
            for (let j = 0; j < headers.length; j++) {
                if (currentline[j]) {
                    currentline[j] = currentline[j].replace(/['"]+/g, '').toUpperCase().trim();
                }
                if (!(headers[j] === 'tipodeegreso') || headers[j] === 'tipodeegreso' && this.tiposEgresosValidos.includes(currentline[j])) {
                    obj[headers[j]] = currentline[j];
                }
            }
            let mensaje = '';
            if (mensaje = this.comprobarEgresos(obj, i)) {
                this.disableGuardar = true;
                this.plex.info('danger', `Archivo egresos: ${mensaje}`);
                this.resetInput();
                return [];
            } else {
                this.disableGuardar = false;
                result.push(obj);
            }
        }
        return result;
    }


    guardarImportacion() {
        try {
            if (this.ingresos.length > 0) {
                this.ultimoNroArchivoIngreso = this.ultimoNroArchivoIngreso + 1;
                this.ingresos.forEach(element => {
                    this.guardarIngreso(element);
                });
                this.ingresos = [];
                this.ocupationsService.export(this.ultimoNroArchivoIngreso).subscribe();
            }
            if (this.egresos.length > 0) {
                this.ultimoNroArchivoEgreso = this.ultimoNroArchivoEgreso + 1;
                this.egresos.forEach(element => {
                    this.guardarEgreso(element);
                });
                this.egresos = [];
                this.checkoutsService.export(this.ultimoNroArchivoIngreso).subscribe();
            }
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
            exportado: false,
            nroArchivo: this.ultimoNroArchivoIngreso
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
            exportado: false,
            nroArchivo: this.ultimoNroArchivoEgreso
        };
        this.checkoutsService.save(egreso).subscribe();
    }

    getUltimoNumeroArchivoIngreso() {
        this.ocupationsService.search({ sort: '-nroArchivo', limit: '1' }).subscribe(elements => {
            if (elements[0] && elements[0].nroArchivo) {
                this.ultimoNroArchivoIngreso = elements[0].nroArchivo;
            } else {
                this.ultimoNroArchivoIngreso = 0;
            }
        });
    }

    getUltimoNumeroArchivoEgreso() {
        this.checkoutsService.search({ sort: '-nroArchivo', limit: '1' }).subscribe(elements => {
            if (elements[0] && elements[0].nroArchivo) {
                this.ultimoNroArchivoEgreso = elements[0].nroArchivo;
            } else {
                this.ultimoNroArchivoEgreso = 0;
            }
        });
    }

    resetInput() {
        this.inputFile.nativeElement.value = '';
    }

    cambiarVerAyuda(mostrar) {
        this.verAyuda = mostrar;
    }

    loadInstitutions() {
        this.institutionService.search({}).subscribe(rtaInstitutions => {
            //toma la primer institucion del usuario
            this.institutions = rtaInstitutions;
            this.institution = rtaInstitutions[0];
        });
    }
}
