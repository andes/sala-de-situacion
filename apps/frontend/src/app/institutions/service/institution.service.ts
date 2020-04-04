import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';

@Injectable()
export class InstitutionService extends ResourceBaseHttp {
    protected url = '/institution'; // URL to web api
    constructor(protected server: Server) {
        super(server);
    }
}
