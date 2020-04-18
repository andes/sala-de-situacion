import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

@Injectable()
export class SelectSearchService {

    constructor(private server: Server) { }

    get(recurso, texto): Observable<any[]> {
        const search = `^${texto}`;
        return this.server.get(`/${recurso}`, { params: { search }, showError: true });
    }

}
