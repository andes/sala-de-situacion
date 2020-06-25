import * as sql from 'mssql';
import { environment } from '../src/environments/environment';
import { OcurrenceEvent } from '../src/app/ocurrence-events/ocurrence-events.schema';

export async function getIndicadores(pool, tabla, fecha) {

    // TODO: armar la consulta correspondiente
    const query = `SELECT * FROM ${tabla} where fecha > ${fecha}`;
    return await new sql.Request(pool).query(query);

}

export async function generateOcurrence(registros, key) {
    // Se matchea la institución

    // Se genera la ocurrencia

    // Guardamos la ocurencias

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

    // última ocurrencia de los indicadores
    const ocupacion = await OcurrenceEvent.findOne({ 'eventKey': 'ocupacion_camas' }).sort([['date', -1]]);
    const egresos = await OcurrenceEvent.findOne({ 'eventKey': 'egresos' }).sort([['date', -1]]);
    const pool = await new sql.ConnectionPool(connection).connect();
    const registrosOcupacion = await getIndicadores(pool, 'ocupaciones', ocupacion.fecha);
    const registrosEgresos = await getIndicadores(pool, 'egresos', egresos.fecha);

    // Se recorren los registros y se crea una ocurrencia por institución y por fechas
    await generateOcurrence(registrosOcupacion, 'ocupacion_camas');
    await generateOcurrence(registrosEgresos, 'egresos');

    pool.close();
    done();
}


async function run(done) {
    await importIndicadores(done);
}

export default run;






