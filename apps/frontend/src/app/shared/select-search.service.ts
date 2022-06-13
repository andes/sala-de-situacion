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
        return this.server.get(`/resources/elements/${recurso}`, { params, showError: true });
    }

}
