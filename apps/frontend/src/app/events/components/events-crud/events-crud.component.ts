import { ResourcesService } from './../../service/resources.service';
import { Component, OnInit } from '@angular/core';
import { Event, EventsService } from '../../service/events.service';
import { Plex } from '@andes/plex';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../login/services/auth.services';
import { OcurrenceEventsService } from '../../../ocurrence-events/services/ocurrence-events.service';

@Component({
    selector: 'app-events-crud',
    templateUrl: './events-crud.component.html',
    styleUrls: ['./events-crud.scss']
})
export class AppEventsCrudComponent implements OnInit {
    public tiposList = [
        { id: 'string', nombre: 'Texto' },
        { id: 'int', nombre: 'Numerico' },
        { id: 'select', nombre: 'Selección' }
    ];
    public recursos = [];
    public hasOcurrences = false;
    public event: Event = {
        id: '',
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
        private route: ActivatedRoute,
        private auth: AuthService,
        private router: Router,
        private ocurrenceEventsService: OcurrenceEventsService,
        private resourcesService: ResourcesService
    ) { }

    ngOnInit() {
        if (!this.auth.checkPermisos('admin:true')) {
            this.router.navigate(['/']);
        }
        this.resourcesService.search({}).subscribe(resultado => {
            this.recursos = resultado;
            const event = this.route.snapshot.data.event;
            if (event) {
                this.event = event;
                this.event.indicadores.forEach(indicador => {
                    indicador.type = this.tiposList.find(t => t.id === indicador.type) as any;
                    if ((indicador.type as any).id === 'select') {
                        indicador.recurso = this.recursos.find(t => t.key === indicador.recurso) as any;
                    }
                });
                this.ocurrenceEventsService.search({ eventKey: event.categoria }).subscribe(response => {
                    this.hasOcurrences = response.length > 0;
                })
            }
        });
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

        setTimeout(() => {
            const element = document.querySelector(`#wrapper-${this.event.indicadores.length - 1}`);
            if (element) {
                element.scrollIntoView({ block: "end", behavior: "smooth" });
            }
        }, 100);
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
                        indicador.recurso = indicador.recurso.key;
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
