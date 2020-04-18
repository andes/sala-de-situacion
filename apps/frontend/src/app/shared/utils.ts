export class Utils {

    constructor() { }

    verificarFormatoEmail(email) {
        let formato = /^[a-zA-Z0-9_.+-]+\@[a-zA-Z0-9-]+(\.[a-z]{2,4})+$/;
        return formato.test(email);

    }
}