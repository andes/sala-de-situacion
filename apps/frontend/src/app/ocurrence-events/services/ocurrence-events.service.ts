import { ResourceBaseHttp, Server } from '@andes/shared';

import { Injectable } from '@angular/core';

export interface OcurrenceEvent {
    id: string;
    eventKey: string;
    activo: boolean;
    fecha: Date;
    institucion: {
        id: string;
        nombre: string;
    };
    indicadores: {
        key: string;
        valor: any;
    }[];
}

@Injectable()
export class OcurrenceEventsService extends ResourceBaseHttp<OcurrenceEvent> {
    protected url = '/ocurrence-events';

    constructor(protected server: Server) {
        super(server);
    }
}
