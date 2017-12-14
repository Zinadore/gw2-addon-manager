import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SettingsKeys } from '../config/app.settings';
import { AppState, ChangeSetting } from '../reducers/index';
import { Store } from '@ngrx/store';
import { FileSystemService } from './filesystem.service';
import { AvailableAddons } from '../addons/models/addon';
import { Update } from '../addons/addons.actions';
import { ArcDpsService } from '../addons/providers/arcdps.service';

@Injectable()
export class AddonService {

  constructor(private electronService: ElectronService,
              private fsService: FileSystemService,
              private arcService: ArcDpsService,
              private store: Store<AppState>) {

  }

  public init(): void {
    const installationPath = this.electronService.fromSettings(SettingsKeys.InstallationPath);

    if (installationPath) {
      this.store.dispatch(new ChangeSetting(SettingsKeys.InstallationPath, installationPath));
      this.store.dispatch(new ChangeSetting(SettingsKeys.IsFirstRun, false));

      this.readAddonsJson(installationPath);
      this.getRemoteVersions();

    }
    this.store.dispatch(new ChangeSetting(SettingsKeys.Loading, false));
  }

  public installAddon(addonId: string) {
    switch (addonId) {
      case AvailableAddons.ArcDPS:
        this.arcService.installArc();
        break;
      case AvailableAddons.BuildTemplates:
        this.arcService.installBuildTemplates();
        break;
      default: return;
    }
  }

  public uninstallAddon(addonId: string) {
    switch (addonId) {
      case AvailableAddons.ArcDPS:
        this.arcService.removeArc();
        break;
      case AvailableAddons.BuildTemplates:
        this.arcService.removeTemplates();
        break;
      default: return;
    }
  }

  private readAddonsJson(installationPath: string) {
    const jsonPath = this.fsService.path.resolve(installationPath, 'bin64', 'addons.json');

    this.fsService.fileExists(jsonPath).then(exists => {
      if (exists) {
        this.fsService.loadJsonFile(jsonPath).then(json => {
            console.log('Received from json file: ', json);
            this.updateAddonsInstalledVersionFromFile(json);
          });
      } else {
        const jObject = this.createDefaultJson(jsonPath);
        this.updateAddonsInstalledVersionFromFile(jObject);
      }
      })
  }

  private createDefaultJson(jsonPath: string): Object {
    console.log('Creating default json file');
    const json = { };
    this.fsService.writeToJsonFile(jsonPath, json);
    json[AvailableAddons.ArcDPS] = '0';
    json[AvailableAddons.BuildTemplates] = '0';
    json[AvailableAddons.RadialMountButton] = '0';
    return json;
  }

  private updateAddonsInstalledVersionFromFile(obj: Object) {
    for (const addon of Object.keys(obj)) {
      this.store.dispatch(new Update(addon, { 'installed_version': obj[addon], 'installed': true}));
    }
  }

  private getRemoteVersions() {
    this.arcService.getArcLatestVersion()
      .subscribe(tag => this.dispatchLatestVersionUpdate(AvailableAddons.ArcDPS, tag));
    this.arcService.getTemplatesLatestVersion()
      .subscribe(tag => this.dispatchLatestVersionUpdate(AvailableAddons.BuildTemplates, tag));

  }

  private dispatchLatestVersionUpdate(id: string, tag: string) {
    this.store.dispatch(new Update(id, { 'latest_version': tag }));
  }
}
