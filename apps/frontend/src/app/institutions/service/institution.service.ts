import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';
import { Observable } from 'rxjs';

@Injectable()
export class InstitutionService extends ResourceBaseHttp {
    protected url = '/institution'; // URL to web api
    constructor(protected server: Server) {
        super(server);
    }

    getInstituciones(params: any): Observable<any[]> {
        params.skip = 0;
        params.limit = 500;
        return this.server.get(this.url, { params, showError: true });
    }
}
