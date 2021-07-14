import { environment } from '../../environments/environment';
const fetch = require('node-fetch');


export async function postNacion(report, token, children?) {
    try {

        const postReportUrl = `${environment.exportadorHost}/api/v1/reports?validation_type=`;

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };
        //Start guard
        await fetch(`${environment.exportadorHost}/api/v1/guards`, { method: 'POST', headers: headers, body: {} });
        // Post report nacion
        const response = await fetch(`${postReportUrl}${children ? 'children' : 'adults'}`, { method: 'POST', headers: headers, body: JSON.stringify(report) });
        //End guard
        await fetch(`${environment.exportadorHost}/api/v1/guards`, { method: 'POST', headers: headers });
        return response;
    } catch (err) {
        return err;
    }
}
