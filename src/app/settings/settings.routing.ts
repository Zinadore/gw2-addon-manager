import { RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './first-run/first-run.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';

const settingsRoutes: Routes = [
  { path: 'first-run', component: FirstRunComponent },
  { path: 'settings-panel', component: SettingsPanelComponent }
];

export const SettingsRouting = RouterModule.forChild(settingsRoutes);
