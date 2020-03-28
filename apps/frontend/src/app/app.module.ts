import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Auth } from '@andes/auth';
import { Server } from '@andes/shared';
import { routing } from './app-routing.module';
import { AppHomeComponent } from './home/home.component';

import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AppHomeComponent
  ],
  imports: [
    BrowserModule,
    PlexModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [
    Plex,
    Server,
    Auth
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
