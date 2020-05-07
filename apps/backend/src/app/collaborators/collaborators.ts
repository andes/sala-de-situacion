import { OcurrenceEvent } from './../ocurrence-events/ocurrence-events.schema';
import { Collaborator } from './collaborator.schema';

import { environment } from '../../environments/environment';
import * as moment from 'moment';
const fetch = require('node-fetch');


export async function getToken(email, password) {
    const url = `${environment.exportadorEndpoints}/auth/login`;
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

export async function exportReports(done) {
    const postReportUrl = `${environment.exportadorEndpoints}/api/v1/reports`;
    const collaborators: any[] = await Collaborator.find({});
    for (const collaborator of collaborators) {
        let token = await getToken(collaborator.email, collaborator.password);
        let institution = collaborator.institution;
        let report = {
            "air_filter_machine": true,
            "created": "string",
            "defibrillators_adults": true,
            "defibrillators_children": true,
            "multi_monitor_adults": true,
            "multi_monitor_children": true,
            "other": "string",
            "respirators_adults": true,
            "respirators_allocated_adult": 0,
            "respirators_allocated_children": 0,
            "respirators_available_adult_count": 0,
            "respirators_available_children_count": 0,
            "respirators_children": true,
            "respirators_unavailable_adult_count": 0,
            "respirators_unavailable_children_count": 0,
            "success_report_salesforce": true,
            "uti_allocated_adult": 0,
            "uti_allocated_adult_gas": 0,
            "uti_allocated_children": 0,
            "uti_allocated_children_gas": 0,
            "uti_discharged_adult_count": 0,
            "uti_discharged_children_count": 0,
            "uti_discharged_dead_adult_count": 0,
            "uti_discharged_dead_children_count": 0,
            "uti_discharged_derivative_adult_count": 0,
            "uti_discharged_derivative_children_count": 0,
            "uti_gas_available_adult_count": 0,
            "uti_gas_available_children_count": 0,
            "uti_gas_unavailable_adult_count": 0,
            "uti_gas_unavailable_children_count": 0,
            "uti_hospitalized_adult_count": 0,
            "uti_hospitalized_children_count": 0,
            "uti_intensive": true,
            "validation_type": "string",
            "vol_inf_pumps": true
        }
        let ocurrenciaDotacion = await this.OcurrenceEvent.find({ 'eventKey': 'dotacion', 'institucion.id': institution }).sort([['date', -1]])[0];
        let ocurrenciaInsumos = await this.OcurrenceEvent.find({ 'eventKey': 'insumos', 'institucion.id': institution }).sort([['date', -1]]);[0]
        let ocurrenciaOcupacion = await this.OcurrenceEvent.find({ 'eventKey': 'ocupacion', 'institucion.id': institution }).sort([['date', -1]])[0];
        //mapeo de indicadores de dotacion pediatria
        report.respirators_allocated_children = 0;
        report.uti_allocated_children = 0;
        report.uti_allocated_children_gas = 0;
        //mapeo de indicadores de ocupación pediatria
        report.respirators_available_children_count = 0;
        report.respirators_unavailable_children_count = 0;
        report.uti_discharged_children_count = 0;
        report.uti_discharged_dead_children_count = 0;
        report.uti_discharged_derivative_children_count = 0;
        report.uti_gas_available_children_count = 0;
        report.uti_gas_unavailable_children_count = 0;
        report.uti_hospitalized_children_count = 0;
        //mapeo de indicadores de ocupación adultos
        report.respirators_available_adult_count = 0;
        report.respirators_unavailable_adult_count = 0;
        report.uti_discharged_adult_count = 0;
        report.uti_discharged_dead_adult_count = 0;
        report.uti_discharged_derivative_adult_count = 0;
        report.uti_gas_available_adult_count = 0;
        report.uti_gas_unavailable_adult_count = 0;
        report.uti_hospitalized_adult_count = 0;
        //mapeo de indicadores de dotacion adultos
        report.respirators_allocated_adult = 0;
        report.uti_allocated_adult = 0;
        report.uti_allocated_adult_gas = 0;
        //mapeo de insumos pediatria
        report.respirators_children = true;
        report.defibrillators_children = true;
        report.multi_monitor_children = true;
        //mapeo de insumos adultos
        report.defibrillators_adults = true;
        report.respirators_adults = true;
        report.multi_monitor_adults = true;
        report.uti_intensive = true;
        report.vol_inf_pumps = true;
        report.air_filter_machine = true;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };
        const reportResponse = await fetch(postReportUrl, { method: 'POST', headers: headers, body: JSON.stringify(report) });
    }
    done();
}



