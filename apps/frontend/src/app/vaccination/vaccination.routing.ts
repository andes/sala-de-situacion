import { VaccinationConsultComponent } from './components/consult/consult.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: 'consulta', component: VaccinationConsultComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class VaccinationRouting { }
