import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppChartComponent } from './components/chart.component';

const routes: Routes = [
    { path: 'dashboard', component: AppChartComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})
export class ChartRouting { }