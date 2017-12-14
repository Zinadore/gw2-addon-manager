import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '../../components/component-base';
import { ElectronService } from '../../providers/electron.service';
import { SettingsKeys } from '../../config/app.settings';

import * as fs from 'fs';
import * as path from 'path';
import { FileSystemService } from '../../providers/filesystem.service';

@Component({
  selector: 'app-installation-path',
  templateUrl: './installation-path.component.html',
  styleUrls: ['./installation-path.component.scss']
})
export class InstallationPathComponent extends ComponentBase implements OnInit {

  public isFirstRun: boolean;
  public current_path: string;

  private fs: typeof fs;
  @Output() pathSet = new EventEmitter<string>();

  constructor(private route: ActivatedRoute,
              private electronService: ElectronService,
              private fsService: FileSystemService,
              private cdr: ChangeDetectorRef) {
    super();
    this.disposeOnDestroy(this.route.params.subscribe(console.log));

    // this.disposeOnDestroy(() => {
    //   this.fs.close(this.current_path);
    // });

    this.isFirstRun = !this.electronService.hasSetting(SettingsKeys.InstallationPath);

    if (this.electronService.isElectron()) {
      this.fs = electronService.remote.require('fs');
    }
  }

  ngOnInit() {
    if (this.isFirstRun) {
      this.current_path = 'Not found';
    } else {
      this.current_path = this.electronService.fromSettings(SettingsKeys.InstallationPath);
    }
  }


  public browseForInstallation(): void {
    const dialog = this.electronService.remote.dialog;

    // showOpenDialog returns an array of paths/strings (in case you can select multiple)
    // so extract the first one directly
    const directory = dialog.showOpenDialog({ properties: ['openDirectory']})[0];
    console.log('Got installation directory: ', directory);
    if (directory) {
      const executablePath = path.join(directory, 'Gw2-64.exe');
      console.log('Executable path:', executablePath);
      this.fsService.fileExists(executablePath).then((exists) => {
        if (exists) {
          this.current_path = directory;
          this.electronService.setSetting(SettingsKeys.InstallationPath, this.current_path);
          this.pathSet.emit(this.current_path);
        } else {
          dialog.showErrorBox('Location error', 'The location you selected does not appear to be a valid GW2 installation');
        }
      });
    }

  }
}
