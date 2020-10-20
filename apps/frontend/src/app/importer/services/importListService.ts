import { Injectable } from '@angular/core';
import { OcupationsService } from './ocupation.service';
import { CheckoutsService } from './checkout.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { cache } from '@andes/shared';
import * as moment from 'moment';

@Injectable()
export class ImportsListService {

    // Filtros
    public fechaDesde = new BehaviorSubject(new Date());
    public fechaHasta = new BehaviorSubject(new Date());
    public institucion = new BehaviorSubject(null);

    ocupaciones$ = combineLatest(
        this.fechaDesde.pipe(filter(date => this.validDate(date))),
        this.fechaHasta.pipe(filter(date => this.validDate(date))),
        this.institucion.pipe(filter(i => this.getId(i)))
    ).pipe(
        switchMap(([desde, hasta, inst]) => {
            return this.searchOcupation(desde, hasta, inst);
        }),
        cache()
    );

    egresos$ = combineLatest(
        this.fechaDesde.pipe(filter(date => this.validDate(date))),
        this.fechaHasta.pipe(filter(date => this.validDate(date))),
        this.institucion.pipe(filter(i => this.getId(i)))
    ).pipe(
        switchMap(([desde, hasta, inst]) => {
            return this.searchCheckouts(desde, hasta, inst);
        }),
        cache()
    );


    constructor(private ocupationRequest: OcupationsService,
        private checkoutRequest: CheckoutsService) { }

    validDate(date: Date) {
        return moment(date).isValid();
    }

    getId(institucion) {
        if (institucion) {
            return institucion.id;
        }
        return null;
    }

    searchOcupation(desde: Date, hasta: Date, institucion: any) {
        const desdeStr = moment(desde).startOf('day').format();
        const hastaStr = moment(hasta).endOf('day').format();
        return this.ocupationRequest.search({
            institution: institucion.id,
            fecha: `${desdeStr}|${hastaStr}`
        });
    }

    searchCheckouts(desde: Date, hasta: Date, institucion: any) {
        const desdeStr = moment(desde).startOf('day').format();
        const hastaStr = moment(hasta).endOf('day').format();
        return this.checkoutRequest.search({
            institution: institucion.id,
            fecha: `${desdeStr}|${hastaStr}`
        });
    }

    setDesde(value: Date) {
        this.fechaDesde.next(value);
    }

    setHasta(value: Date) {
        this.fechaHasta.next(value);
    }

    setInstitucion(value: string) {
        this.institucion.next(value);
    }
}