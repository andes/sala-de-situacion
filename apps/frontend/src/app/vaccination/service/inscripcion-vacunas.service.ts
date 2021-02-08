import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';

@Injectable()
export class InscripcionVacunasService extends ResourceBaseHttp {
    protected url = '/inscripcion-vacunas'; // URL to web api
    constructor(protected server: Server) {
        super(server);
    }
}
