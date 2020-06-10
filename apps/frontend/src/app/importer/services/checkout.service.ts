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
    tipo: String;
    user: {
        id: String,
        nombre: String,
        apellido: String,
        documento: String,
        email: String
    };
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    };
}

@Injectable()
export class CheckoutsService extends ResourceBaseHttp<Checkout> {
    protected url = '/checkouts';

    constructor(protected server: Server) {
        super(server);
    }
}
