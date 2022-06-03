import { environment } from '../../../src/environments/environment';
import { CovidEvents } from './covid-events.schema';
import { transformEvento } from './transform-event';
import * as moment from 'moment';

const fetch = require('node-fetch');

async function generateCDAAndes(caso) {
    try {
        const url = `${environment.cda_sisa_host}/cda/sisa`;
        const headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };

        try {
            return await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ data: { caso } })
            });
        } catch (err) {
            return {};
        }
    } catch (err) {
        return err;
    }
}

async function saveCases(casos) {
    try {
        for (const _caso of casos) {
            if (_caso.idEventoCaso) {
                const caso = transformEvento(_caso)
                await CovidEvents.updateOne({ ideventocaso: caso.ideventocaso }, caso, { upsert: true });
                if (caso.clasif_RESUMEN) {
                    generateCDAAndes(caso)
                }
            }
        };
    } catch (err) {
        return err;
    }
}

async function importCase(ideventocaso) {
    try {
        const url = `${environment.snvs.host}/snvs-api68/v1/covidNominal/SnvsNominalCoronavirus?`;
        const headers = {
            'APP_ID': environment.snvs.appId,
            'APP_KEY': environment.snvs.appKey,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };
        const params = new URLSearchParams({
            id: ideventocaso
        });
        try {
            const response = await fetch(url + params, {
                method: 'GET',
                headers: headers
            });
            const body = await response.json();
            await saveCases([body]);
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

async function getCasesByDate(date) {
    const url = `${environment.snvs.host}/snvs-api68/v1/covidNominal/novedades?`;
    const headers = {
        'APP_ID': environment.snvs.appId,
        'APP_KEY': environment.snvs.appKey,
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

export async function importCasesCovidDate(done, days) {
    try {
        //Actualiza los casos de los últimos días definidos por days
        for (let i = 0; i < days; i++) {
            const strDate = moment().startOf('day').add(i * (-1)).format('DD/MM/YYYY');
            const casos = await getCasesByDate(strDate);
            if (casos.length > 0) {
                await saveCases(casos);
            }
        }
    } catch (err) {
        return err;
    }
    done();
}

export async function updateCasesCovid(date) {
    try {
        // eliminar los casos de una fecha específica
        await deleteCovidEventsByDate(date);
        const { eventos } = await getCasesByDate(date)
        for (const evento of eventos) {
            await importCase(evento);
        }
    } catch (err) {
        return err;
    }
}
