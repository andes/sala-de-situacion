import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
/**
 * Repetido por ahora hasta modularizar mejor los componentes.
 * Deberíams hacer un ngModule de servicios o ngModule de Snomed por lo menos.
 */

@Injectable()
export class LocationService {
    private provinciaURL = '/provincia'; // URL to web api
    private localidadURL = '/localidad'; // URL to web api
    private barrioURL = '/barrio'; // URL to web api

    constructor(private server: Server) {}

    getProvincia(nombre: String): Observable<any> {
        return this.server.get(this.provinciaURL + '?nombre=' + nombre);
    }
    getProvincias(params: any): Observable<any[]> {
        return this.server.get(this.provinciaURL, { params, showError: true });
    }

    getLocalidad(nombre: String): Observable<any> {
        return this.server.get(this.localidadURL + '?nombre=' + nombre);
    }

    getLocalidades(params: any): Observable<any[]> {
        return this.server.get(this.localidadURL, { params, showError: true });
    }

    getBarrio(nombre: String): Observable<any> {
        return this.server.get(this.barrioURL + '?nombre=' + nombre);
    }
    getBarrios(params: any): Observable<any[]> {
        return this.server.get(this.barrioURL, { params, showError: true });
    }
}
