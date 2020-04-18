import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';


@Injectable()
export class GeoreferenciaService {
    private url = '/georeferencia'; // URL to web api

    constructor(private server: Server) {
    }

    get(params: any) {
        return this.server.get(`${this.url}`, { params });//En params vendria la direccion
    }

}
