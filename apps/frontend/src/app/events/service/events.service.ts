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

@Injectable()
export class EventsService extends ResourceBaseHttp<Event> {
    protected url = '/api/events';

    constructor(protected server: Server) {
        super(server);
    }
}
