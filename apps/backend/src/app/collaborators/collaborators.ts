import { Collaborator } from './collaborator.schema';
import { OcurrenceEvent } from '../ocurrence-events/ocurrence-events.schema';
import { Servicio } from '../servicios/servicios.schema';
import { ReportEvent } from '../report-events/report-events.schema';
import { environment } from '../../environments/environment';
import { Types } from 'mongoose';

const fetch = require('node-fetch');

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

async function generarReport(type, institution, servicio) {
    const report = {};

    const dotacion = await OcurrenceEvent.findOne({ 'eventKey': 'camas_dotacion', 'institucion.id': Types.ObjectId(institution), 'indicadores.servicio_dotacion': servicio.nombre }).sort([['date', -1]]);
    const egreso = await OcurrenceEvent.findOne({ 'eventKey': 'egresos', 'institucion.id': Types.ObjectId(institution), 'indicadores.servicio_egresos': servicio.nombre }).sort([['date', -1]]);
    const ocupacion = await OcurrenceEvent.findOne({ 'eventKey': 'ocupacion_camas', 'institucion.id': Types.ObjectId(institution), 'indicadores.servicio_ocupa': servicio.nombre }).sort([['date', -1]]);
    const lastReport = await ReportEvent.findOne({ type: 'adults' }).sort([['date', -1]]);

    const ocurrenciaDotacion = dotacion ? dotacion.indicadores : null;
    const ocurrenciaEgresos = egreso ? egreso.indicadores : null;
    const ocurrenciaOcupacion = ocupacion ? ocupacion.indicadores : null;
    let respiradoresLiberados = 0;
    let egresos_alta = 0;
    let egresos_defuncion = 0;
    let egresos_derivados = 0;

    if (ocurrenciaDotacion || ocurrenciaEgresos || ocurrenciaOcupacion) {
        const totalRespiradores = ocurrenciaDotacion['camas_con_respirador'] || 0;  // cantidad total de respiradores
        const respiradoresOcupados = ocurrenciaOcupacion['ocupadas_c_respirador'] || 0;  // Cantidad de respiradores ocupados
        if (!lastReport || (lastReport && (ocupacion && ocupacion.fecha > lastReport['fecha']))) {
            respiradoresLiberados = ocurrenciaOcupacion['disponibles_c_respirador'];  // Cantidad de respiradores liberados desde la última carga
        }
        report[`respirators_allocated_${type}`] = totalRespiradores;  // cantidad total de respiradores
        report[`respirators_available_${type}_count`] = respiradoresLiberados;  // Cantidad de respiradores liberados desde la última carga
        report[`respirators_unavailable_${type}_count`] = respiradoresOcupados;
        report[`uti_allocated_${type}`] = ocurrenciaDotacion['total_dotacion'] || 0; // Dotación: Total de camas
        report[`uti_allocated_${type}_gas`] = ocurrenciaDotacion['total_c_oxigeno'] || 0; // Dotacion: total de camas con oxígenos en la UTI

        if (!lastReport || (lastReport && (egreso && egreso.fecha > lastReport['fecha']))) {
            egresos_alta = ocurrenciaEgresos && ocurrenciaEgresos['egresos_alta_medica'] ? ocurrenciaEgresos['egresos_alta_medica'] : 0;  // Cantidad de egresos por alta médica desde la última carga  UTI
            egresos_defuncion = ocurrenciaEgresos && ocurrenciaEgresos['egresos_defuncion'] ? ocurrenciaEgresos['egresos_defuncion'] : 0; // Cantidad de Egresos por fallecimiento desde la última carga UTI
            egresos_derivados = ocurrenciaEgresos && ocurrenciaEgresos['egresos_derivados'] ? ocurrenciaEgresos['egresos_derivados'] : 0; // Cantidad de Egresos derivados desde la última carga UTI
        }
        report[`uti_discharged_${type}_count`] = egresos_alta;
        report[`uti_discharged_dead_${type}_count`] = egresos_defuncion;
        report[`uti_discharged_derivative_${type}_count`] = egresos_derivados

        report[`uti_gas_available_${type}_count`] = ocurrenciaOcupacion['disponibles_c_oxigeno'] || 0; // Camas disponibles con oxígeno UTI
        report[`uti_gas_unavailable_${type}_count`] = ocurrenciaOcupacion['ocupadas_c_oxigeno'] || 0; // Camas ocupadas con oxígeno de UTI
        report[`uti_hospitalized_${type}_count`] = (ocurrenciaOcupacion['total_internados'] || 0);  // Cantidad de Internados total en el servicio
        return report;
    }
    return null;


}

export async function exportReports(done) {
    const postReportUrl = `${environment.exportadorHost}/api/v1/reports?validation_type=`;
    const collaborators: any[] = await Collaborator.find({ activo: true });

    for (const collaborator of collaborators) {
        const token = await getToken(collaborator.email, collaborator.password);
        if (token) {
            const institution = collaborator.institution.id;
            let servicio_uti = await Servicio.find({ nombre: 'UNIDAD DE TERAPIA INTENSIVA' });
            const reportAdult = await generarReport('adult', institution, servicio_uti[0]);
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            };
            //Start guard
            await fetch(`${environment.exportadorHost}/api/v1/guards`, { method: 'POST', headers: headers, body: {} });
            // Se envian los reportes de Adultos y Children
            if (reportAdult) {
                await fetch(`${postReportUrl}adults`, { method: 'POST', headers: headers, body: JSON.stringify(reportAdult) });
                // se guarda el reporte enviado
                const reporteNacionAdult = {
                    fecha: new Date(),
                    type: 'adults',
                    institucion: collaborator.institution,
                    servicio: servicio_uti,
                    report: reportAdult
                };
                const reportEventAdult = new ReportEvent(reporteNacionAdult);
                await reportEventAdult.save();
            }
            servicio_uti = await Servicio.find({ nombre: 'UNIDAD DE TERAPIA INTENSIVA PEDIATRICA' });
            const reportChildren = await generarReport('children', institution, servicio_uti[0]);
            if (reportChildren) {
                await fetch(`${postReportUrl}children`, { method: 'POST', headers: headers, body: JSON.stringify(reportChildren) });
                // se guarda el reporte enviado
                const reporteNacionChildren = {
                    fecha: new Date(),
                    type: 'children',
                    institucion: collaborator.institution,
                    servicio: servicio_uti,
                    report: reportChildren
                };
                const reportEventChildren = new ReportEvent(reporteNacionChildren);
                await reportEventChildren.save();
            }
            //End guard
            await fetch(`${environment.exportadorHost}/api/v1/guards`, { method: 'POST', headers: headers });
        }
    }


    done();
}



