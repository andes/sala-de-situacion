import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';

@Injectable()
export class DisclaimerService extends ResourceBaseHttp {
    protected url = '/disclaimers'; // URL to web api
    constructor(protected server: Server) {
        super(server);
    }
}
