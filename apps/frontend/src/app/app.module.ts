import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { AppHomeComponent } from './home/home.component';

import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './login/components/login/auth.services';
import { Auth } from '@andes/auth';
import { RoutingNavBar, RoutingGuard } from './login/routing-guard';

@NgModule({
    declarations: [AppComponent, AppHomeComponent],
    imports: [BrowserModule, PlexModule, FormsModule, HttpClientModule, routing],
    providers: [Plex, Server, Auth, AuthService, RoutingNavBar, RoutingGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
