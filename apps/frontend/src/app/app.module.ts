import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { AppHomeComponent } from './home/home.component';

import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './login/auth.services';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';
import { EventsModule } from './events/events-module';

@NgModule({
    declarations: [AppComponent, AppHomeComponent],
    imports: [BrowserModule, PlexModule, FormsModule, HttpClientModule, routing, EventsModule],
    providers: [Plex, Server, AuthService, RoutingNavBar, RoutingGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
