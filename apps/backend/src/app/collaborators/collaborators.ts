import { Collaborator } from './collaborator.schema';
import { environment } from '../../environments/environment';
const fetch = require('node-fetch');
import * as debug from 'debug';
const log = debug('roboSender');

export async function getToken(email, password) {
    const url = `${environment.exportadorHost}/auth/login`;
    const headers = {
        "Content-Type": "application/json"
    }
    const data = {
        "email": email,
        "password": password
    }
    const response = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
    const responseJson = await response.json();
    if (responseJson.access_token) {
        return responseJson.access_token;
    }
    return null;
}

async function generarReport(type, institution) {
    const servicio = type === 'adult' ? 'UNIDAD DE TERAPIA INTENSIVA' : 'UNIDAD DE TERAPIA INTENSIVA PEDIATRICA';
    const report = {};

    const ocurrenciaDotacion = await this.OcurrenceEvent.find({ 'eventKey': 'camas_dotacion', 'institucion.id': institution, 'indicadores.servicio_dotacion': servicio }).sort([['date', -1]])[0];
    const ocurrenciaEgresos = await this.OcurrenceEvent.find({ 'eventKey': 'egresos', 'institucion.id': institution, 'indicadores.servicio_egresos': servicio }).sort([['date', -1]]);[0]
    const ocurrenciaOcupacion = await this.OcurrenceEvent.find({ 'eventKey': 'ocupacion_camas', 'institucion.id': institution, 'indicadores.servicio_ocupa': servicio }).sort([['date', -1]])[0];

    if (ocurrenciaDotacion || ocurrenciaEgresos || ocurrenciaOcupacion) {
        report[`respirators_allocated_${type}`] = 0;  // cantidad total de respiradores
        report[`respirators_available_${type}_count`] = 0;  // Cantidad de respiradores liberados desde la última carga
        report[`respirators_unavailable_${type}_count`] = ocurrenciaOcupacion['indicadores.con_respirador'] || 0;  // Cantidad de respiradores ocupados
        report[`uti_allocated_${type}`] = ocurrenciaDotacion['indicadores.total_dotacion'] || 0; // Dotación: Total de camas
        report[`uti_allocated_${type}_gas`] = ocurrenciaDotacion['indicadores.total_c_oxigeno'] || 0; // Dotacion: total de camas con oxígenos en la UTI
        report[`uti_discharged_${type}_count`] = ocurrenciaEgresos['indicadores.egresos_alta_medica'] || 0;  //Cantidad de egresos por alta médica desde la última carga  UTI
        report[`uti_discharged_dead_${type}_count`] = ocurrenciaEgresos['indicadores.egresos_defuncion'] || 0; // Cantidad de Egresos por fallecimiento en la UTI
        report[`uti_discharged_derivative_${type}_count`] = ocurrenciaEgresos['indicadores.egresos_derivados'] || 0; // Cantidad de Egresos derivados desde la UTI
        report[`uti_gas_available_${type}_count`] = ocurrenciaOcupacion['indicadores.disponibles_c_oxigeno'] || 0; // Camas disponibles con oxígeno UTI
        report[`uti_gas_unavailable_${type}_count`] = ocurrenciaOcupacion['indicadores.ocupadas_c_oxigeno'] || 0; // Camas ocupadas con oxígeno de UTI
        report[`uti_hospitalized_${type}_count`] = (ocurrenciaOcupacion['indicadores.ocupadas_c_oxigeno'] || 0) + (ocurrenciaOcupacion['indicadores.ocupadas_s_oxigeno'] || 0);  // Cantidad de Internados total en el servicio
        return report;
    } else {
        return null
    }

}

export async function exportReports(done) {
    const postReportUrl = `${environment.exportadorHost}/api/v1/reports?validation_type=`;
    const collaborators: any[] = await Collaborator.find({});
    log('Encuentro ', collaborators.length, 'colaboradores.');
    for (const collaborator of collaborators) {
        const token = await getToken(collaborator.email, collaborator.password);
        const institution = collaborator.institution.id;
        const reportAdult = generarReport('adult', institution);
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };
        //Start guard
        await fetch(`${environment.exportadorHost}/api/v1/guards`, { method: 'POST', headers: headers });

        // Se envian los reportes
        if (reportAdult) {
            await fetch(`${postReportUrl}adults`, { method: 'POST', headers: headers, body: JSON.stringify(reportAdult) });
        }
        const reportChildren = generarReport('children', institution);
        if (reportChildren) {
            await fetch(`${postReportUrl}children`, { method: 'POST', headers: headers, body: JSON.stringify(reportChildren) });
        }
        //End guard
        await fetch(`${environment.exportadorHost}/api/v1/guards`, { method: 'POST', headers: headers });
    }
    done();
}



