import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlexModule } from '@andes/plex';
import { SafePipe } from './safe.pipe';
import { AppChartComponent } from './components/chart.component';
import { EpidemiologiaComponent } from './components/epidemiologia.component';
import { ChartRouting } from './chart.routing';
import { ChartsService } from './service/charts.service';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        ChartRouting
    ],
    exports: [
        AppChartComponent,
        EpidemiologiaComponent
    ],
    declarations: [
        AppChartComponent,
        EpidemiologiaComponent,
        SafePipe,
    ],
    providers: [
        ChartsService
    ]
})
export class ChartModule { }
