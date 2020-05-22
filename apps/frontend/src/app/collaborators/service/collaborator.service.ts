import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';

@Injectable()
export class CollaboratorService extends ResourceBaseHttp {
    protected url = '/collaborator'; // URL to web api
    constructor(protected server: Server) {
        super(server);
    }
}
