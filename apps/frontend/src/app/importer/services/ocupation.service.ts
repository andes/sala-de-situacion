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
        enum: ['DISPONIBLE', 'BLOQUEADA', 'OCUPADA']
    };
    respirador: {
        type: String,
        enum: ['SI', 'NO']
    };
    covid: {
        type: String,
        enum: ['SI', 'NO']
    };
    oxigeno: {
        type: String,
        enum: ['SI', 'NO']
    };
    institution: {
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        nombre: String
    };
    exportado: boolean;
    nroArchivo: number;
    createdAt: Date;
}

@Injectable()
export class OcupationsService extends ResourceBaseHttp<Ocupation> {
    protected url = '/ocupations';

    constructor(protected server: Server) {
        super(server);
    }

    export(archivo) {
        return this.server.get(`${this.url}/export/${archivo}`);
    }
}
