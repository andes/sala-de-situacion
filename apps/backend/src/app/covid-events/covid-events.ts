import { environment } from '../../../src/environments/environment';
import * as moment from 'moment';
import { CovidEvents, CovidEventsTemp } from './covid-events.schema';
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
        fullView: 'true'
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

async function saveCases(casos, temp) {
    try {
        for (const caso of casos) {
            if (caso.ideventocaso) {
                caso.min_FTM = transformDate(caso.min_FTM);
                caso.fecha_APERTURA = transformDate(caso.fecha_APERTURA);
                caso.fecha_INTERNACION = transformDate(caso.fecha_INTERNACION);
                caso.fecha_CUI_INTENSIVOS = transformDate(caso.fecha_CUI_INTENSIVOS);
                caso.fecha_ALTA_MEDICA = transformDate(caso.fecha_ALTA_MEDICA);
                caso.fecha_MOD_EVENTO = transformDate(caso.fecha_MOD_EVENTO);
                caso.fecha_MOD_DIAG = transformDate(caso.fecha_MOD_DIAG);
                caso.fecha_NACIMIENTO = transformDate(caso.fecha_NACIMIENTO);
                caso.fecha_DIAGNOSTICO = transformDate(caso.fecha_DIAGNOSTICO);
                caso.fecha_MOD_CLASIF = new Date(caso.fecha_MOD_CLASIF);
                caso.fecha_GRAFICO = new Date(caso.fecha_GRAFICO);
                if (!temp) {
                    await CovidEvents.updateOne({ ideventocaso: caso.ideventocaso }, caso, { upsert: true });
                } else {
                    const newCaso = new CovidEventsTemp(caso);
                    await newCaso.save();
                }
            }
        };
    } catch (err) {
        return err;
    }
}

async function importCase(token, ideventocaso) {
    try {
        const url = `${environment.snvs.host}/snvs/covid19/casos/idCaso/15?`;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };
        const params = new URLSearchParams({
            ideventocaso: ideventocaso
        });
        try {
            const response = await fetch(url + params, {
                method: 'GET',
                headers: headers
            });
            const body = await response.json();
            await saveCases([body], false);
            return body;
        } catch (err) {
            return {};
        }
    } catch (err) {
        return err;
    }
}

async function deleteCovidEventsByDate(date) {
    try {
        if (date) {
            const filters = {
                'fecha_MOD_EVENTO': {
                    $gte: moment(date).startOf('day').toDate(),
                    $lte: moment(date).endOf('day').toDate()
                }
            };
            await CovidEvents.deleteMany(filters);
        }
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
    let cantidad = 0;
    while (retry) {
        try {
            const casos = await importCasesPerPage(token, page.toString());
            if (casos.length > 0) {
                cantidad = cantidad + casos.length;
                await saveCases(casos, true);
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

async function getCasesByDate(token, date) {
    const url = `${environment.snvs.host}/snvs/covid19/casos/mod/15?`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json',
        'Accept': 'application/json'
    };
    const params = new URLSearchParams({
        fecha: moment(date).format('DD/MM/YYYY')
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

export async function updateCasesCovid(done, date) {
    const user = environment.snvs.user;
    const pass = environment.snvs.pass;
    let token = await getToken(user, pass);
    try {
        if (token !== null) {
            // eliminar los casos de una fecha específica
            // await deleteCovidEventsByDate(date);
            const casos = await getCasesByDate(token, date)
            for (const caso of casos) {
                let retry = true;
                while (retry) {
                    const datosCaso = await importCase(token, caso);
                    if (datosCaso.status === 401) {
                        //Se refresca el token
                        token = await getToken(user, pass);
                    } else {
                        retry = false;
                    }
                }
            }
        }
    } catch (err) {
        return err;
    }
    done();
}



