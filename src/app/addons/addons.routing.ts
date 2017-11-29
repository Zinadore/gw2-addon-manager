import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const addonsRoutes: Routes = [
  { path: 'home', component: HomeComponent}
];

export const AddonsRoutes = RouterModule.forChild(addonsRoutes);
