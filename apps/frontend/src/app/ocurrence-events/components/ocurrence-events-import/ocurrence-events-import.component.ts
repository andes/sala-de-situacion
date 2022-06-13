import { Component, OnInit, ViewChild } from '@angular/core';
import { EventsService, Event } from '../../../events/service/events.service';
import { InstitutionService } from '../../../institutions/service/institution.service';
import { Plex } from '@andes/plex';
import { OcurrenceEventsService } from '../../services/ocurrence-events.service';
import { SelectSearchService } from '../../../shared/select-search.service';
import { Location } from '@angular/common';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'occurrence-events-import',
    templateUrl: './ocurrence-events-import.component.html'
})
export class OccurrenceEventsImportComponent implements OnInit {
    @ViewChild('inputFile', null) inputFile;

    public institution: any;
    public institutions$: Observable<any>;
    public event: Event;
    public events$: Observable<Event[]>;
    public occurrenceEvents = [];
    public eventDate: Date;
    public verAyuda = false;
    private recursosIndicadores = [];

    constructor(
        private eventsService: EventsService,
        private ocurrenceEventsService: OcurrenceEventsService,
        private institutionService: InstitutionService,
        private selectSearchService: SelectSearchService,
        private location: Location,
        private plex: Plex,
    ) {}

    ngOnInit() {
        this.institutions$ = this.institutionService.search({})
            .pipe(map(rta => {
                if (!this.institution && rta.length === 1) {
                    this.institution = rta[0];
                }
            }));
        this.events$ = this.eventsService.search({});
        this.eventDate = new Date();
    }

    public changeListener(files: FileList) {
        const foo = () => {
            let file: File = files.item(0);
            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv = reader.result;
                this.csvParseEvento(csv);
            }
        };
        if (files && files.length > 0) {
            const indicadoresKeys =  this.event.indicadores.filter(i => i.type === 'select').map(i => i.recurso);
            if (indicadoresKeys.length) {
                this.selectSearchService.getByKeys(indicadoresKeys).subscribe( rta => {
                    this.recursosIndicadores = rta; 
                    foo();
                });
            } else {
                foo();
            }
        }
    }

    public csvParseEvento(csv) {
        let lines = csv.split("\n");
        const regexCSV = /,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/;

        lines.shift()
        lines.pop();

        for (let line of lines ) {
            let currentline = line.split(regexCSV);
            let result: any = this.limeToOccurrenceEvent(currentline) as any;
            
            if (result.error) {
                this.plex.info('danger', `Archivo evento: ${result.error}`);
                this.occurrenceEvents = [];
                this.inputFile.nativeElement.value = '';
                break;
            } else {
                this.occurrenceEvents.push(result.occurrenceEvent);
            }
        };
    }

    private limeToOccurrenceEvent(line) {
        let mensajeError = '';
        if (line.length !== this.event.indicadores.length ) {
            mensajeError += `La cantidad de campos obtenidos no corresponde`;
        }

        let occurrenceEvent = this.newOcurrenceEvent();

        this.event.indicadores.forEach((indicador, i) => {
            let indicadorKey = this.event.indicadores[i].key
            let val = line[i];
            if (indicador.type === 'int') {
                val = Number(val);
                if (!Number.isInteger(val)) {
                    mensajeError += `El valor no es un número válido (linea ${line}).`;
                } else if (val < indicador.min) {
                    mensajeError += `Valor mínimo excedido: ${indicador.min} (linea ${line}).`;
                } else if (val > indicador.max) {
                    mensajeError += `Valor máximo excedido: ${indicador.max} (linea ${line}).`;
                } else {
                    occurrenceEvent.indicadores[indicadorKey] = val;
                }
            } else if (indicador.type === 'select') {
                if (!this.recursosIndicadores.filter(e => e.key === indicadorKey).find(e => e.nombre === val)) {
                    mensajeError += `El valor '${val}' no es válido. (linea ${line}).`;
                }
            } else {
                occurrenceEvent.indicadores[indicadorKey] = val;
            }
        });

        return mensajeError ? { error: mensajeError } : { occurrenceEvent };
    }

    private newOcurrenceEvent() {
        return { 
            eventKey: this.event.categoria,
            activo: true,
            fecha: this.eventDate,
            institucion: {
                id: this.institution.id,
                nombre: this.institution.nombre
            },
            indicadores: {}
        };
    }

    mostrarAyuda() {
        this.verAyuda = true;
    }

    ocultarAyuda() {
        this.verAyuda = false;
    }

    onSave() {
        forkJoin(this.occurrenceEvents.map(e => this.ocurrenceEventsService.save(e)))
        .subscribe(() => {
            this.plex.toast('success', 'Indicadores registrados con exito! ');
            this.location.back();
        });
    }
}
