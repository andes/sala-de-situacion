import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppChartComponent } from './components/chart.component';
import { EpidemiologiaComponent } from './components/epidemiologia.component';

const routes: Routes = [
    { path: 'dashboard', component: AppChartComponent },
    { path: 'epidemiologia', component: EpidemiologiaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})
export class ChartRouting { }