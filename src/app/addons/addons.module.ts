import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AddonsRoutes } from './addons.routing';
import { addonReducer } from './addons.reducer';
import { StoreModule } from '@ngrx/store';
import { MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AddonsRoutes,
    StoreModule.forFeature('addons', addonReducer),
    MatTableModule
  ],
  declarations: [
    HomeComponent,
  ],
  exports: [
    HomeComponent
  ]
})
export class AddonsModule { }
