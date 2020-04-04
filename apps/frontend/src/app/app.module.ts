import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Server } from '@andes/shared';
import { AppRouting } from './app-routing.module';
import { AppHomeComponent } from './home/home.component';

import { NgxObserveModule } from 'ngx-observe';
import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';
import { AuthService } from './login/auth.services';
import { LocationService } from './shared/location.services';
import { InstitutionProvidersModule } from './institution/institution.provider';

@NgModule({
    declarations: [AppComponent, AppHomeComponent],
    imports: [
        BrowserModule,
        PlexModule,
        FormsModule,
        HttpClientModule,
        AppRouting,
        NgxObserveModule,
        InstitutionProvidersModule
    ],
    providers: [Plex, Server, AuthService, RoutingNavBar, RoutingGuard, LocationService],
    bootstrap: [AppComponent]
})
export class AppModule {}
