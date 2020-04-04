import { Component } from '@angular/core';
import { Event, EventsService } from '../../service/events.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';

@Component({
    selector: 'app-events-crud',
    templateUrl: './events-crud.component.html'
})
export class AppEventsCrudComponent {
    public tiposList = [
        { id: 'string', nombre: 'Texto' },
        { id: 'int', nombre: 'Numerico' }
    ];
    public event: Event = {
        categoria: '',
        nombre: '',
        activo: true,
        indicadores: [
            {
                key: '',
                descripcion: '',
                label: '',
                required: true,
                type: '',
                extras: {}
            }
        ]
    };

    constructor(private plex: Plex, private eventsService: EventsService, private location: Location) {}

    onAdd() {
        this.event.indicadores.push({
            key: '',
            descripcion: '',
            label: '',
            required: true,
            type: '',
            extras: {}
        });
        this.event.indicadores = [...this.event.indicadores];
    }

    onRemove(i) {
        this.event.indicadores.splice(i, 1);
        this.event.indicadores = [...this.event.indicadores];
    }

    save($event) {
        if (!this.event.indicadores.length) {
            return this.plex.toast('danger', 'Al menos debes agregar un indicador');
        }
        if ($event.formValid) {
            const dataSaved = {
                ...this.event,
                indicadores: this.event.indicadores.map(i => {
                    const indicador: any = { ...i };
                    indicador.type = indicador.type.id;
                    return indicador;
                })
            };
            this.eventsService.save(dataSaved).subscribe(() => {
                this.location.back();
            });
        }
    }
}
