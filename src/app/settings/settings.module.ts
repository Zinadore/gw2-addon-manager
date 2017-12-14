import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRouting } from './settings.routing';
import { InstallationPathComponent } from './installation-path/installation-path.component';
import { FirstRunComponent } from './first-run/first-run.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRouting,
    // StoreModule.forFeature('settings', settingsReducer)
  ],
  declarations: [
    InstallationPathComponent,
    FirstRunComponent,
    SettingsPanelComponent
  ],
  exports: [
  ]
})
export class SettingsModule { }
