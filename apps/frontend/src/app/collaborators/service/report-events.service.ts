import { ResourceBaseHttp, Server } from '@andes/shared';
import { Injectable } from '@angular/core';

export interface ReportEvent {
    id: string;
    eventKey: string;
    activo: boolean;
    fecha: Date;
    institucion: {
        id: string;
        nombre: string;
    };
    indicadores: any;
}

@Injectable({ providedIn: 'root' })
export class ReportEventsService extends ResourceBaseHttp<ReportEvent> {
    protected url = '/report-events';

    constructor(protected server: Server) {
        super(server);
    }

    export(reportEvent) {
        return this.server.post(`${this.url}/export`, { reportEvent });
    }


}
