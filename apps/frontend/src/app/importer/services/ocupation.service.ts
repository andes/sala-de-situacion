import { ResourceBaseHttp, Server } from '@andes/shared';
import { Injectable } from '@angular/core';
import * as mongoose from 'mongoose';


export interface Ocupation {
    fechaIngreso: Date;
    horaIngreso: String;
    apellido: String;
    nombre: String;
    dni: String;
    habitacion: String;
    piso: String;
    servicio: String;
    cama: String;
    estado: {
        type: String,
        enum: ['disponible', 'bloqueda', 'ocupada']
    },
    repirador: String;
    covid: String;
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
export class OcupationsService extends ResourceBaseHttp<Ocupation> {
    protected url = '/ocupations';

    constructor(protected server: Server) {
        super(server);
    }
}
