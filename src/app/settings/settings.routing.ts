import { RouterModule, Routes } from '@angular/router';
import { FirstRunComponent } from './first-run/first-run.component';

const settingsRoutes: Routes = [
  { path: 'first-run', component: FirstRunComponent}
];

export const SettingsRouting = RouterModule.forChild(settingsRoutes);
