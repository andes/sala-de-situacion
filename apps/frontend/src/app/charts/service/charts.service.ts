import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';

@Injectable()
export class ChartsService extends ResourceBaseHttp {
    protected url = '/charts';
    constructor(protected server: Server) {
        super(server);
    }

    getEmbeddedChart(params: any) {
        return this.server.get(`${this.url}/embedded/urls`, { params });
    }
}
