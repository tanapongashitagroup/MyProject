import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MdMenuModule, MdButtonModule, MdToolbarModule, MdCardModule, MdProgressBarModule } from '@angular/material';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    BrowserAnimationsModule,
    MdMenuModule,
    MdButtonModule,
    MdToolbarModule,
    MdProgressBarModule,
    MdCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
