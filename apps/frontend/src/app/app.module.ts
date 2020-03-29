import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { AppHomeComponent } from './home/home.component';
import { AppInstitutionComponent } from './institution/institution.component';

import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocationService } from './shared/location.services';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';
import { AuthService } from './login/auth.services';

@NgModule({
    declarations: [AppComponent, AppHomeComponent, AppInstitutionComponent],
    imports: [BrowserModule, PlexModule, FormsModule, HttpClientModule, routing],
    providers: [Plex, Server, AuthService, RoutingNavBar, RoutingGuard, LocationService],
    bootstrap: [AppComponent]
})
export class AppModule {}
