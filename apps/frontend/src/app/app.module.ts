import { NgModule } from '@angular/core';
import { CollaboratorService } from './collaborators/service/collaborator.service';
import { DisclaimerService } from './login/services/disclaimer.services';
import { OcurrenceEventsService } from './ocurrence-events/services/ocurrence-events.service';
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { Server } from '@andes/shared';
import { AppRouting } from './app-routing.module';
import { AppHomeComponent } from './home/home.component';

import { NgxObserveModule } from 'ngx-observe';
import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';
import { AuthService } from './login/services/auth.services';
import { UserService } from './login/services/user.services';
import { LocationService } from './shared/location.services';
import { InstitutionProvidersModule } from './institutions/institution.provider';
import { ChartModule } from './charts/chart.module';
import { CollaboratorModule } from './collaborators/collaborator.module';
import { SelectSearchService } from './shared/select-search.service';
import { AyudaComponent } from './home/ayuda.component';

@NgModule({
    declarations: [AppComponent, AppHomeComponent, AyudaComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        PlexModule,
        FormsModule,
        HttpClientModule,
        AppRouting,
        NgxObserveModule,
        InstitutionProvidersModule,
        ChartModule,
        CollaboratorModule
    ],
    providers: [Plex, Server, AuthService, RoutingNavBar, RoutingGuard, LocationService, SelectSearchService, UserService, OcurrenceEventsService, DisclaimerService, CollaboratorService],
    bootstrap: [AppComponent]
})
export class AppModule { }
