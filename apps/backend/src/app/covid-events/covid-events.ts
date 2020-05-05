import { environment } from '../../../src/environments/environment';
import * as moment from 'moment';
import { CovidEvents } from './covid-events.schema';
const fetch = require('node-fetch');

export async function getToken(user: string, pass: string) {
    const url = `${environment.snvs.host}/auth/realms/sisa/protocol/openid-connect/token`;
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', 'snvs-token');
    formData.append('username', user);
    formData.append('password', pass);
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        json: true,
    }
    const response = await fetch(
        url,
        options
    );
    const responseJson = await response.json();
    if (responseJson.access_token) {
        return responseJson.access_token
    }
    return null;
}

function transformDate(fecha: string) {
    if (moment(fecha, 'DD/MM/YYYY', true).isValid()) {
        const [day, month, year] = fecha.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    return null;
}

async function importCasesPerPage(token, page: string) {
    const url = `${environment.snvs.host}/snvs/covid19/casos?`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json',
        'Accept': 'application/json'
    };
    const params = new URLSearchParams({
        offset: page,
        fullview: 'true'
    });
    try {
        const response = await fetch(url + params, {
            method: 'GET',
            headers: headers
        });
        const body = await response.json();
        return body;

    } catch (err) {
        return [];
    }
}

async function saveCases(casos) {
    try {
        const lista = [];
        casos.forEach((caso: any) => {
            if (caso.ideventocaso) {
                caso.min_FTM = transformDate(caso.min_FTM);
                caso.fecha_APERTURA = transformDate(caso.fecha_APERTURA);
                caso.fecha_INTERNACION = transformDate(caso.fecha_INTERNACION);
                caso.fecha_CUI_INTENSIVOS = transformDate(caso.fecha_CUI_INTENSIVOS);
                caso.fecha_ALTA_MEDICA = transformDate(caso.fecha_ALTA_MEDICA);
                let casoReportado = CovidEvents.findOne({ ideventocaso: caso.ideventocaso });
                casoReportado = caso;
                caso = new CovidEvents(casoReportado);
                lista.push(caso.save());
            }
        });
        await Promise.all(lista);
    } catch (err) {
        return err;
    }
}


export async function importCasesCovid(done) {
    const user = environment.snvs.user;
    const pass = environment.snvs.pass;
    let token = await getToken(user, pass);

    let retry = true;
    let page = 0;
    while (retry) {
        try {
            const casos = await importCasesPerPage(token, page.toString());
            if (casos.length > 0) {
                await saveCases(casos);
                page++;
            } else {
                if (casos.status === 401) {
                    //Se refresca el token
                    token = await getToken(user, pass);
                } else {
                    retry = false;
                }
            }
        } catch (err) {
            return err;
        }
    }
    done();

}



