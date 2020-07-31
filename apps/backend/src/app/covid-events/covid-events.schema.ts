
import * as mongoose from 'mongoose';

export const CovidEventsSchema = new mongoose.Schema({
    ideventocaso: { type: Number, required: true },
    evento: String,
    ambito_CONCURRENCIA: String,
    nombre: String,
    apellido: String,
    tipo_DOC: String,
    nro_DOC: String,
    sexo: String,
    edad_ACTUAL: Number,
    edad_DIAGNOSTICO: Number,
    embarazada: String,
    idpaisresidencia: Number,
    pais_RESIDENCIA: String,
    provincia_RESIDENCIA: String,
    se_DECLARA_PUEBLO_INDIGENA: String,
    departamento_RESIDENCIA: String,
    localidad_RESIDENCIA: String,
    provincia_CARGA: String,
    localidad_CARGA: String,
    localidad_METRICAS: String,
    establecimiento_CARGA: String,
    etnia: String,
    signo_SINTOMA: String,
    fis: String,
    pais_VIAJE_FECHA: String,
    ppl: String,
    muestra_FTM: String,
    determinacion_RESULTADO: String,
    dialisis_AGUDA: Number,
    dialisis_CRONICA: Number,
    antecedente_EPIDEMIOLOGICO: String,
    min_FTM: Date,
    observaciones: String,
    clasificacion_MANUAL: String,
    codigo_CIUDADANO: Number,
    servicio_PENITENCIARIO: String,
    fecha_APERTURA: Date,
    sepi_APERTURA: String,
    sepi_CONSULTA: String,
    sepi_SINTOMA: String,
    internado: String,
    curado: String,
    fecha_INTERNACION: Date,
    cuidado_INTENSIVO: String,
    fecha_CUI_INTENSIVOS: Date,
    fecha_DIAGNOSTICO: Date,
    fecha_ALTA_MEDICA: Date,
    fallecido: String,
    fecha_FALLECIMIENTO: String,
    asist_RESP_MECANICA: String,
    causa_FALLECIMIENTO_VINCULADA: String,
    causa_FALLECIMIENTO: String,
    id_PROVINCIA_RESIDENCIA: Number,
    id_PROVINCIA_CARGA: Number,
    id_SNVS_GRUPO_EVENTO: Number,
    user_MOD_EVENTO: String,
    fecha_MOD_EVENTO: Date,
    fecha_NACIMIENTO: Date,
    user_MOD_DIAG: String,
    fecha_MOD_DIAG: Date,
    origen_FINANCIAMIENTO: String,
    estab_DIAGNOSTICO: String,
    clasificacion: String,
    fecha_MOD_CLASIF: Date,
    valor_ANTERIOR: String,
    valor_NUEVO: String,
    validacion: String,
    clasif_RESUMEN: String,
    grupo_ETARIO: String,
    clasif_EPIDEMIO: String,
    ultimo_ESTAB_DIAG: String,
    codigo_REFES_ESTAB_CARGA: String,
    ocupacion: String,
    operativo_DETECCION: String,
    calle_DOMICILIO: String,
    numero_DOMICILIO: String,
    fecha_GRAFICO: Date,
    grupo_ETARIO_DECADA: String,
    cobertura_SOCIAL: String,
    malbran: String,
    id_DEPTO_INDEC_RESIDENCIA: String,
    id_DEPTO_INDEC_CARGA: String,
    asma: Number,
    bajo_PESO: Number,
    bronquio_PREVIA: Number,
    dbt: Number,
    embarazo: Number,
    enf_NEURO_PREVIA: Number,
    enf_ONCO_PREVIA: Number,
    epoc: Number,
    hepato_CRONICA: Number,
    hta: Number,
    id_DEPARTAMENTO_CARGA: Number,
    id_DEPARTAMENTO_RESIDENCIA: Number,
    inmunos_CONGENITA: Number,
    insf_CARDIACA: Number,
    insf_RENAL: Number,
    nac_PREVIA: Number,
    nacionalidad: String,
    obesidad: Number,
    prematuro: Number,
    sin_COMORB: Number,
    tbc: Number,
    ex_FUMADOR: Number,
    fumador: Number,
    barrio_POPULAR: String,
    tratamiento_FECHA_RESULTADO: String,
    ULTIMA_ACTUALIZACION: Date,
    id_PROVINCIA_INDEC: String,
    id_PROVINCIA_METRICAS: Number,
    estab_DIAG_NO_MALBRAN: String,
    grupo_ETARIO_MORTALIDAD: String,
    estab_INTERNACION: String,
    codigo_REFES_ESTAB_INTERNACION: String,
    info_CONTACTO: String,
    vigilancia_ACTIVA: String
});


export const CovidEvents = mongoose.model('covid_events', CovidEventsSchema, 'covid_events');