import { ResourceBaseHttp, Server } from '@andes/shared';
import * as mongoose from 'mongoose';
import { Injectable } from '@angular/core';

export interface Checkout {
    fechaEgreso: Date;
    horaEgreso: String;
    apellido: String;
    nombre: String;
    dni: String;
    fechaIngreso: Date;
    horaIngreso: String;
    tipo: {
        type: String,
        enum: ['DEFUNCION', 'ALTA', 'DERIVACION', 'RETIRO VOLUNTARIO']
    };
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    };
    exportado: boolean;
    nroArchivo: number;
}

@Injectable()
export class CheckoutsService extends ResourceBaseHttp<Checkout> {
    protected url = '/checkouts';

    constructor(protected server: Server) {
        super(server);
    }
}
