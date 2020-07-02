import * as sql from 'mssql';
import { environment } from '../src/environments/environment';
import { OcurrenceEvent } from '../src/app/ocurrence-events/ocurrence-events.schema';
import { Institution } from '../src/app/institution/institution.schema';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Servicio } from '../src/app/servicios/servicios.schema';
import * as moment from 'moment';
 
export async function getIndicadores(pool, tabla, fieldFecha, fecha) {
    // TODO: armar la consulta correspondiente
    const query = `SELECT * FROM ${tabla} where ${fieldFecha} > '${fecha}'`;
    return await new sql.Request(pool).query(query);

}

async function getInstitucion(nombreInstitucion) {
    const regexp = `${nombreInstitucion}$`;
    const org : any = await Institution.findOne({nombre:{$regex:new RegExp(regexp, "i")}});
    if (org) {
        return org;
    }
    return null;
}

async function getServicio(nombreServicio) {
    let servicio = null;
    if (nombreServicio){
        const regexp = `${nombreServicio}$`;
        servicio = await Servicio.findOne({nombre:new RegExp(regexp, "i")});
    }
    // if (!servicio) {
    //     console.log('nombreServicio', nombreServicio, 'servicio ', servicio);
    // }
    if (servicio) {
        return servicio._id;
    }
    return null;
}

async function mapearIndicadores(doc, key){
    let indicadores = {};
    // Se machea el servicio
    const idServicio = await getServicio(doc.Servicio);
    switch (key) {
        case 'ocupacion_camas':
            indicadores = {
                servicio_ocupa: doc.Servicio,
                id_servicio_ocupa: idServicio,
                disponibles_c_respirador: doc.CamasDisponiblesconRespirador,
                ocupadas_c_respirador: doc.CamasOcupadasconRespirador,
                bloqueadas_c_respirador: doc.CamasBloqueadasconRespirador,
                disponibles_c_oxigeno: doc.CamasDisponiblesconOxigeno,
                ocupadas_c_oxigeno: doc.CamasOcupadasconOxigeno,
                bloqueadas_c_oxigeno: doc.CamasBloqueadasconOxigeno,
                disponibles_s_oxigeno: doc.CamasDisponiblessinOxigeno,
                ocupadas_s_oxigeno: doc.CamasOcupadassinOxigeno,
                bloqueadas_s_oxigeno: doc['CamasBloqueadassinOxigeno '],
                total_c_respirador: doc.CamasDisponiblesconRespirador + doc.CamasOcupadasconRespirador + doc.CamasBloqueadasconRespirador,
                total_c_oxigeno: doc.CamasDisponiblesconOxigeno + doc.CamasOcupadasconOxigeno + doc.CamasBloqueadasconOxigeno,
                total_s_oxigeno: doc.CamasDisponiblessinOxigeno + doc.CamasOcupadassinOxigeno + doc['CamasBloqueadassinOxigeno ']
            }
            break;
        case 'egresos': {
            const alta = doc.AltaMedica?doc.AltaMedica:0;
            const derivados = doc['Traslado a otro establecimiento']?doc['Traslado a otro establecimiento']:0;
            const defuncion = doc.Defuncion?doc.Defuncion:0;
            indicadores = {
                id_servicio_egresos: idServicio,
                servicio_egresos: doc.Servicio,
                egresos_alta_medica: alta,
                egresos_derivados: derivados,
                egresos_defuncion: defuncion,
                total_egresos: alta + derivados + defuncion
            }
        }
    }
    return indicadores;
}

export async function generateOcurrences(registros, key, fieldFecha) {
    const cantidadRegistros = registros.length;
    if (cantidadRegistros > 0) {
        for (let i = 0; i < cantidadRegistros; i++) {
            const doc = registros[i];
            const ocurrence:any = {};
            ocurrence.activo = true;
            ocurrence.eventKey = key;
            // Se machea la institucion
            const institution = await getInstitucion(doc.Efector);
            if (institution) {
                ocurrence.institution = {
                    id: Types.ObjectId(institution._id),
                    nombre: institution.nombre
                };
            } else {
                ocurrence.institution = { nombre: doc.Efector }
            }
           
            // Se genera el objeto ocurrence_event 
            ocurrence.fecha = new Date(doc[fieldFecha]);
            const indicadores = await mapearIndicadores(doc, key);
            ocurrence.indicadores = indicadores;
            
            try {
                ocurrence.createdAt = new Date();
                ocurrence.createdBy = {
                    email : "info@andes.gob.ar",
                    nombre : "import-indicadores",
                    apellido : "import-indicadores",
                    documento : "0"
                }
                // TODO: Mejorar este codigo
                const ocurrenceEvent = new OcurrenceEvent(ocurrence);
                const col = await mongoose.connection.db.collection('ocurrence_event');
                await col.insert(ocurrenceEvent); 
                // await ocurrenceEvent.save(ocurrence);
            } catch(error){
                return error;
            }
        }
    } 
}

async function importIndicadores(done) {
    const connection = {
        user: environment.conSql.auth.user,
        password: environment.conSql.auth.password,
        server: environment.conSql.serverSql.server,
        database: environment.conSql.serverSql.database,
        options: {
            encrypt: true
        }
    };

    // Se obtiene la última ocurrencia de los indicadores para tener las fechas por las cuales filtrar
    const ocupacion = await OcurrenceEvent.findOne({ 'eventKey': 'ocupacion_camas' }).sort([['date', -1]]);
    const fechaOcupacion = moment(ocupacion.fecha).format('YYYY-MM-DD');
    const egresos = await OcurrenceEvent.findOne({ 'eventKey': 'egresos' }).sort([['date', -1]]);
    const fechaEgresos = moment(egresos.fecha).format('YYYY-MM-DD');

    // Se obtienen los indicadores de SQL
    const pool = await new sql.ConnectionPool(connection).connect();
    const registrosOcupacion = await getIndicadores(pool, 'Ocupacion_Camas', 'fecha', fechaOcupacion);
    const registrosEgresos = await getIndicadores(pool, 'egresos', 'fechaEgreso', fechaEgresos);
    
    // Se recorren los registros y se crean las ocurrencia en ocurrence_events
    await generateOcurrences(registrosOcupacion.recordset, 'ocupacion_camas', 'fecha');
    await generateOcurrences(registrosEgresos.recordset, 'egresos', 'fechaEgreso');

    pool.close();
    done();
}



async function run(done) {
    await importIndicadores(done);
}

export default run;






