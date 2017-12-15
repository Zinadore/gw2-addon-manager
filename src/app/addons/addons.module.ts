import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AddonsRoutes } from './addons.routing';
import { addonReducer } from './addons.reducer';
import { StoreModule } from '@ngrx/store';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ArcDpsService } from './providers/arcdps.service';
import { HttpClientModule } from '@angular/common/http';
import { AddonDisplayComponent } from './components/addon-display/addon-display.component';
import { LoadersCssModule } from 'angular2-loaders-css';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AddonsRoutes,
    StoreModule.forFeature('addons', addonReducer),
    LoadersCssModule,
    MatProgressBarModule
  ],
  declarations: [
    HomeComponent,
    AddonDisplayComponent,
  ],
  providers: [
    ArcDpsService
  ],
  exports: [
    HomeComponent
  ]
})
export class AddonsModule { }
