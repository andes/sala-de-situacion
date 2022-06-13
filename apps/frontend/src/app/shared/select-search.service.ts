import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class SelectSearchService {

    constructor(private server: Server) { }

    get(recurso, texto): Observable<any[]> {
        let search = null;
        if (texto) {
            search = texto;
        }
        const params = {
            search
        }
        return this.server.get(`/resources/elements/${0}`, { params, showError: true });
    }

    getByKeys(keys): Observable<any[]> {
        keys = Array.isArray(keys) ? keys : [keys];
        let url = `/resources?`;
        keys.forEach(k => url+= `key=${k}&`);
        url = url.slice(0, -1)
        return this.server.get(url);
    }
}
