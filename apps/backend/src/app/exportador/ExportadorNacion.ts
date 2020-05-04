const fetch = require('node-fetch');
import { environment } from '../../environments/environment'

export async function login(email, password) {
    //console.log('Running login');
    const url = `${environment.exportadorEndpoints.auth}login`;
    const headers = {
        "Content-Type": "application/json"
    }
    const data = {
        "email": email,
        "password": password
    }
    await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            //console.log('Login finalizado');
            //console.log(json);
        }).catch((err) => {
            //console.log('Termina la ejecución', err);
        });
}
