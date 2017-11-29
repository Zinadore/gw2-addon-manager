import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { Router } from '@angular/router';
import { SettingsKeys } from './config/app.settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private electronService: ElectronService, private router: Router) {

    if (electronService.isElectron()) {
      console.log('Mode electron');
      // Check if electron is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    if (!electronService.hasSetting(SettingsKeys.InstallationPath)) {
      router.navigate(['/installation-path', { fresh: true }]);
    } else {
      router.navigate(['/home']);
    }
  }
}
