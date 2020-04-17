import { ResourceBaseHttp, Server } from '@andes/shared';

import { Injectable } from '@angular/core';

export interface OcurrenceEventHistory {
    eventKey: string;
    activo: boolean;
    fecha: Date;
    institucion: {
        id: string;
        nombre: string;
    };
    indicadores: any;
    originalRef: any
}

@Injectable()
export class OcurrenceEventsHistoryService extends ResourceBaseHttp<OcurrenceEventHistory> {
    protected url = '/ocurrence-events-history';

    constructor(protected server: Server) {
        super(server);
    }
}
