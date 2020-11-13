// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API: '//localhost:3000/api',

  TRANSLATIONS: {
    respirators_allocated_adult: 'Dotación respiradores',
    respirators_available_adult_count:'Respiradores disponibles',
    respirators_unavailable_adult_count:'Respiradores ocupados',
    uti_allocated_adult:'Dotación camas',
    uti_allocated_adult_gas:'Dotación camas con oxigeno',
    uti_discharged_adult_count:'Egresos por alta médica',
    uti_discharged_dead_adult_count:'Egresos por deceso ',
    uti_discharged_derivative_adult_count:'Egresos por derivación',
    uti_gas_available_adult_count:'Oxigeno disponible',
    uti_gas_unavailable_adult_count:'Oxigeno ocupado',
    uti_hospitalized_adult_count:'Total internaciones',
    respirators_allocated_children: 'Dotación respiradores',
    respirators_available_children_count:'Respiradores disponibles',
    respirators_unavailable_children_count:'Respiradores ocupados',
    uti_allocated_children:'Dotación camas',
    uti_allocated_children_gas:'Dotación camas con oxigeno',
    uti_discharged_children_count:'Egresos por alta médica',
    uti_discharged_dead_children_count:'Egresos por deceso ',
    uti_discharged_derivative_children_count:'Egresos por derivación',
    uti_gas_available_children_count:'Oxigeno disponible',
    uti_gas_unavailable_children_count:'Oxigeno ocupado',
    uti_hospitalized_children_count:'Total internaciones',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
