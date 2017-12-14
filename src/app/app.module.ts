import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadersCssModule } from 'angular2-loaders-css';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { SettingsModule } from './settings/settings.module';
import { AddonsModule } from './addons/addons.module';
import { reducers } from './reducers/index';
import { FileSystemService } from './providers/filesystem.service';
import { AddonService } from './providers/addon.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'environments';

let imports = [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  StoreModule.forRoot(reducers),
  ]

if (!environment.production) {
  imports.push(
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  )
}
imports = [
  ...imports,
  LoadersCssModule,
  AppRoutingModule,
  SettingsModule,
  AddonsModule
];


@NgModule({
  declarations: [
    AppComponent,
    TitlebarComponent
  ],
  imports: [
    ...imports
  ],
  providers: [
    ElectronService,
    FileSystemService,
    AddonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
