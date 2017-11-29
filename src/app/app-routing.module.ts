import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstallationPathComponent } from './components/installation-path/installation-path.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'installation-path', component: InstallationPathComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
