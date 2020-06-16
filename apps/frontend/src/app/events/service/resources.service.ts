import { ResourceBaseHttp, Server } from '@andes/shared';
import { Injectable } from '@angular/core';

export interface Resource {
    id: string,
    nombre: string;
    key: string;
    activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class ResourcesService extends ResourceBaseHttp<Event> {
    protected url = '/resources';

    constructor(protected server: Server) {
        super(server);
    }
}
