import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { PlexModule, Plex } from '@andes/plex';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppHomeComponent } from './home/home.component';

@NgModule({
    declarations: [AppComponent, AppHomeComponent],
    imports: [
        BrowserModule,
        PlexModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: 'home', component: AppHomeComponent }], {
            initialNavigation: 'enabled'
        })
    ],
    providers: [Plex],
    bootstrap: [AppComponent]
})
export class AppModule {}
