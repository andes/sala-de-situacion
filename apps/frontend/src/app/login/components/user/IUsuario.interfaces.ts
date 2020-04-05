export interface IPermiso {
    institucion: {
        _id: String,
        nombre: string
    },
    accesos: String[]
}
export interface IUsuario {
    id: String;
    documento: String,
    nombre: String,
    apellido: String,
    email: String,
    telefono: String,
    permisos?: IPermiso[]
}
