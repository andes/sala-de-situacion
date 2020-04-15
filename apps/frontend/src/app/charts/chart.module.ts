import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { SafePipe } from './safe.pipe'
import { AppChartComponent } from './components/chart.component';
import { ChartRouting } from './chart.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        ChartRouting
    ],
    exports: [AppChartComponent],
    declarations: [
        AppChartComponent,
        SafePipe
    ],
    providers: [],

})
export class ChartModule { }