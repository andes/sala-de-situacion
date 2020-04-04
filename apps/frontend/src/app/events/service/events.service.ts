import { ResourceBaseHttp, Server } from '@andes/shared';
import { Injectable } from '@angular/core';

export interface Event {
    categoria: string;
    nombre: string;
    activo: boolean;
    indicadores: {
        key: string;
        label: string;
        type: string;
        descripcion: string;
        required: boolean;
        extras: any;
    }[];
}

@Injectable({ providedIn: 'root' })
export class EventsService extends ResourceBaseHttp<Event> {
    protected url = '/events';

    constructor(protected server: Server) {
        super(server);
    }
}
