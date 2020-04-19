import { Component, OnInit } from '@angular/core';
import { Event, EventsService } from '../../service/events.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-events-crud',
    templateUrl: './events-crud.component.html'
})
export class AppEventsCrudComponent implements OnInit {
    public tiposList = [
        { id: 'string', nombre: 'Texto' },
        { id: 'int', nombre: 'Numerico' },
        { id: 'select', nombre: 'Selección' }
    ];

    /** Eso podria ser configurable */
    public selectList = [
        { id: 'servicios', nombre: 'Servicios' },
        { id: 'localidad', nombre: 'Localidades' },
        { id: 'provincia', nombre: 'Provincias' },
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
                subfiltro: true
            }
        ]
    };

    constructor(
        private plex: Plex,
        private eventsService: EventsService,
        private location: Location,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const event = this.route.snapshot.data.event;
        if (event) {
            this.event = event;
            this.event.indicadores.forEach(indicador => {
                indicador.type = this.tiposList.find(t => t.id === indicador.type) as any;
                if (indicador.recurso === 'select') {
                    indicador.recurso = this.selectList.find(t => t.id === indicador.recurso) as any;
                }
            });
        }
    }

    onAdd() {
        this.event.indicadores.push({
            key: '',
            descripcion: '',
            label: '',
            required: true,
            type: '',
            subfiltro: false
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
                    if (indicador.type === 'select') {
                        indicador.recurso = indicador.recurso.id;
                    } else {
                        indicador.recurso = null;
                    }
                    return indicador;
                })
            };
            this.eventsService.save(dataSaved).subscribe(() => {
                this.location.back();
            });
        }
    }
}
