import * as sql from 'mssql';
import { environment } from '../src/environments/environment';
import { OcurrenceEvent } from '../src/app/ocurrence-events/ocurrence-events.schema';
import { Institution } from '../src/app/institution/institution.schema';
import { Types } from 'mongoose';
import { Servicio } from '../src/app/servicios/servicios.schema';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { OcurrenceEventHistory } from '../src/app/ocurrence-events-history/ocurrence-events-history.schema';


export async function getIndicadores(pool, query) {
    return await new sql.Request(pool).query(query);
}

async function getInstitucion(nombreInstitucion) {
    const regexp = `${nombreInstitucion}$`;
    const org: any = await Institution.findOne({ activo: true, nombre: { $regex: new RegExp(regexp, "i") } });
    if (org) {
        return org;
    }
    return null;
}

async function getServicio(nombreServicio) {
    let servicio = null;
    if (nombreServicio) {
        const regexp = `${nombreServicio}$`;
        servicio = await Servicio.findOne({ nombre: new RegExp(regexp, "i") });
        if (!servicio) {
            servicio = await Servicio.findOne({ equivalencias: RegExp(nombreServicio.toLowerCase()) });
        }
        return servicio;
    }
    return null;
}
function mapearIndicadores(doc, servicio, key) {
    let indicadores = {};
    if (servicio) {
        switch (key) {
            case 'ocupacion_camas':
                indicadores = {
                    servicio_ocupa: servicio.nombre,
                    id_servicio_ocupa: servicio._id || null,
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
                const alta = doc.AltaMedica ? doc.AltaMedica : 0;
                const derivados = doc['Traslado a otro establecimiento'] ? doc['Traslado a otro establecimiento'] : 0;
                const defuncion = doc.Defuncion ? doc.Defuncion : 0;
                indicadores = {
                    id_servicio_egresos: servicio._id || null,
                    servicio_egresos: servicio.nombre,
                    egresos_alta_medica: alta,
                    egresos_derivados: derivados,
                    egresos_defuncion: defuncion,
                    total_egresos: alta + derivados + defuncion
                }
            }

        }
    }
    return indicadores;
}

function generateOccupation(doc, servicio) {
    const indicadores = {
        servicio_ocupa: servicio.nombre || null,
        id_servicio_ocupa: servicio._id || null,
        disponibles_c_respirador: 0,
        ocupadas_c_respirador: 0,
        bloqueadas_c_respirador: 0,
        disponibles_c_oxigeno: 0,
        ocupadas_c_oxigeno: 0,
        bloqueadas_c_oxigeno: 0,
        disponibles_s_oxigeno: 0,
        ocupadas_s_oxigeno: 0,
        bloqueadas_s_oxigeno: 0,
        total_c_respirador: 0,
        total_c_oxigeno: 0,
        total_s_oxigeno: 0
    };
    if (doc.estado && doc.estado.toLowerCase() === 'disponible') {
        if (doc.respirador.toLowerCase().includes('si')) {
            indicadores['disponibles_c_respirador'] = doc.cantidad;
        }
        if (doc.tipo.toLowerCase().includes('con')) {
            indicadores['disponibles_c_oxigeno'] = doc.cantidad;
        } else {
            indicadores['disponibles_s_oxigeno'] = doc.cantidad;
        }
    }

    if (doc.estado && doc.estado.toLowerCase() === 'ocupada') {
        if (doc.respirador.toLowerCase().includes('si')) {
            indicadores['ocupadas_c_respirador'] = doc.cantidad;
        }
        if (doc.tipo.toLowerCase().includes('con')) {
            indicadores['ocupadas_c_oxigeno'] = doc.cantidad;
        } else {
            indicadores['ocupadas_s_oxigeno'] = doc.cantidad;
        }
    }

    if (doc.estado && (doc.estado.toLowerCase().trim() === 'bloqueada' || doc.estado.toLowerCase().trim() === 'inactiva')) {
        if (doc.respirador.toLowerCase().includes('si')) {
            indicadores['bloqueadas_c_respirador'] = doc.cantidad;
        }
        if (doc.tipo.toLowerCase().includes('con')) {
            indicadores['bloqueadas_c_oxigeno'] = doc.cantidad;
        } else {
            indicadores['bloqueadas_s_oxigeno'] = doc.cantidad;
        }
    }
    indicadores['total_c_respirador'] = indicadores['disponibles_c_respirador'] + indicadores['ocupadas_c_respirador'] + indicadores['bloqueadas_c_respirador'];
    indicadores['total_c_oxigeno'] = indicadores['disponibles_c_oxigeno'] + indicadores['ocupadas_c_oxigeno'] + indicadores['bloqueadas_c_oxigeno'];
    indicadores['total_s_oxigeno'] = indicadores['disponibles_s_oxigeno'] + indicadores['ocupadas_s_oxigeno'] + indicadores['bloqueadas_s_oxigeno'];

    return indicadores;
}

function crearIndicadores(doc, servicio, key) {
    let indicadores = {};

    if (servicio) {
        switch (key) {
            case 'ocupacion_camas':
                indicadores = generateOccupation(doc, servicio);
                break;
            case 'egresos': {
                const alta = doc.alta ? doc.alta : 0;
                const derivados = ((doc.traslado || 0) + (doc.derivacion || 0));
                const defuncion = doc.defuncion ? doc.Defuncion : 0;
                indicadores = {
                    id_servicio_egresos: servicio._id || null,
                    servicio_egresos: servicio.nombre,
                    egresos_alta_medica: alta,
                    egresos_derivados: derivados,
                    egresos_defuncion: defuncion,
                    total_egresos: alta + derivados + defuncion
                }
            }
        }
    }
    return indicadores;

}

export async function generateOcurrences(registros, key, fieldFecha, publico = true) {
    const cantidadRegistros = registros.length;
    if (cantidadRegistros > 0) {
        for (let i = 0; i < cantidadRegistros; i++) {
            const doc = registros[i];
            let ocurrence: any = {};
            // Se machea la institucion
            const institution = await getInstitucion(doc.Efector);
            try {
                if (institution && institution.id) {
                    ocurrence.institucion = {
                        id: Types.ObjectId(institution.id),
                        nombre: institution.nombre
                    };
                } else {
                    ocurrence.institucion = { nombre: doc.Efector }
                }
                // Se busca el servicio
                const servicio = await getServicio(doc.Servicio);
                if (servicio) {
                    let ocurrencia_ocupacion = null;
                    // Se recupera la última ocurrencia por institución y por servicio
                    if (key === 'ocupacion_camas') {
                        ocurrencia_ocupacion = await OcurrenceEvent.findOne({ 'eventKey': key, 'institucion.id': ocurrence.institucion.id, 'indicadores.id_servicio_ocupa': servicio._id }).sort([['date', -1]]);
                    } else {
                        ocurrencia_ocupacion = await OcurrenceEvent.findOne({ 'eventKey': key, 'institucion.id': ocurrence.institucion.id, 'indicadores.id_servicio_egresos': servicio._id }).sort([['date', -1]]);
                    }

                    const fecha_ocurrencia = doc[fieldFecha] ? new Date(doc[fieldFecha]) : new Date();
                    if (!ocurrencia_ocupacion || (ocurrencia_ocupacion && ocurrencia_ocupacion.fecha < fecha_ocurrencia)) {
                        // Se crea una nueva ocurrencia
                        if (!ocurrencia_ocupacion) {
                            ocurrence.activo = true;
                            ocurrence.eventKey = key;
                        } else {
                            ocurrence = ocurrencia_ocupacion;
                        }
                        ocurrence.fecha = fecha_ocurrencia;
                        const indicadores = publico ? mapearIndicadores(doc, servicio, key) : crearIndicadores(doc, servicio, key);
                        ocurrence.indicadores = indicadores;
                        ocurrence.createdAt = new Date();
                        ocurrence.createdBy = {
                            email: "info@andes.gob.ar",
                            nombre: "import-indicadores",
                            apellido: "import-indicadores",
                            documento: "0"
                        }
                        const ocurrenceEvent = new OcurrenceEvent(ocurrence);
                        const col = await mongoose.connection.db.collection('ocurrence_event');
                        if (!ocurrenceEvent.id || !ocurrenceEvent._id) {
                            await col.insertOne(ocurrenceEvent);
                        } else {
                            await col.updateOne({ _id: ocurrenceEvent._id }, ocurrenceEvent, { upsert: true });
                        }
                        const eventHistory = {
                            eventKey: ocurrenceEvent.eventKey,
                            activo: ocurrenceEvent.activo,
                            fecha: ocurrenceEvent.fecha,
                            institucion: ocurrenceEvent.institucion,
                            indicadores: ocurrenceEvent.indicadores,
                            originalRef: ocurrenceEvent._id,
                            createdAt: ocurrence.createdAt,
                            createdBy: ocurrence.createdBy
                        };
                        await OcurrenceEventHistory.create(eventHistory);
                    }
                }


            } catch (error) {
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
    const fechaEgresos = egresos ? moment(egresos.fecha).format('YYYY-MM-DD') : moment().startOf('day').format('YYYY-MM-DD');


    const pool = await new sql.ConnectionPool(connection).connect();
    // Se obtienen los indicadores de SQL para los efectores públicos
    const query_ocupaciones = `SELECT * FROM Ocupacion_Camas where fecha > '${fechaOcupacion}'`;
    const registrosOcupacionPublicos = await getIndicadores(pool, query_ocupaciones);
    const query_egresos = `SELECT * FROM Egresos where fechaEgreso >= '${fechaEgresos}'`;
    const registrosEgresosPublicos = await getIndicadores(pool, query_egresos);

    // Se recorren los registros y se crean las ocurrencia en ocurrence_events
    await generateOcurrences(registrosOcupacionPublicos.recordset, 'ocupacion_camas', 'fecha', true);
    await generateOcurrences(registrosEgresosPublicos.recordset, 'egresos', 'fechaEgreso', true);

    // Se obtienen los indicadores de SQL para los efectores privados
    const query_internacion = `SELECT Efector, Servicio, estado, Tipo as tipo, respirador, count(*) as cantidad
    FROM Internacion_New
    GROUP BY Efector, Servicio, estado, Tipo, respirador`;

    const query = `SELECT * FROM
    (Select  Efector, Servicio, fechaEgreso as FechaEgreso, count(*) as Cantidad,
     CASE
     WHEN LOWER(TipoEgreso) like '%defun%'  THEN 'defuncion'
     WHEN LOWER(TipoEgreso) like '%retiro%' THEN 'retiro'
     WHEN LOWER(TipoEgreso) like '%alta%' THEN 'alta'
     WHEN LOWER(TipoEgreso) like '%traslado%' THEN 'traslado'
     WHEN LOWER(TipoEgreso) like '%derivacion%' THEN 'derivacion'
     ELSE 'otro'
     END as TipoEgreso
     FROM Egresos_New where fechaEgreso >= '${fechaEgresos}'
     GROUP BY Efector, Servicio, fechaEgreso, TipoEgreso ) AS SourceTable PIVOT(SUM([Cantidad]) FOR [TipoEgreso] IN(
                                                          [derivacion],
                                                          [defuncion],
                                                          [retiro],
                                                          [traslado],
                                                          [alta],
                                                          [otro]
                                                          )) AS PivotTable`;

    const registrosOcupacion = await getIndicadores(pool, query_internacion);
    const registrosEgresos = await getIndicadores(pool, query);

    // Se recorren los registros y se crean las ocurrencia en ocurrence_events
    await generateOcurrences(registrosOcupacion.recordset, 'ocupacion_camas', 'fecha', false);
    await generateOcurrences(registrosEgresos.recordset, 'egresos', 'fechaEgreso', false);


    pool.close();
    done();
}



async function run(done) {
    await importIndicadores(done);
}

export default run;






