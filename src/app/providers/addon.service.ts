import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SettingsKeys } from '../config/app.settings';
import { AppState, ChangeSetting } from '../reducers/index';
import { Store } from '@ngrx/store';
import { FileSystemService } from './filesystem.service';
import { AvailableAddons } from '../addons/models/addon';
import { Update } from '../addons/addons.actions';
import { ArcDpsService } from '../addons/providers/arcdps.service';
import { ComponentBase } from '../components/component-base';

@Injectable()
export class AddonService extends ComponentBase {

  constructor(private electronService: ElectronService,
              private fsService: FileSystemService,
              private arcService: ArcDpsService,
              private store: Store<AppState>) {
    super();
    this.disposeOnDestroy(this.store.select(state => state.settings.installation_path)
      .do(p => console.log('From observable chain', p))
      .filter(p => p !== '')
      .subscribe(p => this.readAddonsJson(p))
    );
  }

  public init(): void {
    const installationPath = this.electronService.fromSettings(SettingsKeys.InstallationPath);

    this.getRemoteVersions();

    if (installationPath) {
      this.store.dispatch(new ChangeSetting(SettingsKeys.InstallationPath, installationPath));
      this.store.dispatch(new ChangeSetting(SettingsKeys.IsFirstRun, false));

      this.readAddonsJson(installationPath);
    } else {
      this.finishedLoading();
    }
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
        console.log('Creating default file');
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
    this.finishedLoading();
  }

  private finishedLoading(): void {
    this.store.dispatch(new ChangeSetting(SettingsKeys.Loading, false));
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
