import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/combineLatest';
import { ComponentBase } from '../../components/component-base';
import { AppState } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { Update } from '../addons.actions';
import { ElectronService } from '../../providers/electron.service';
import {
  INSTALL_ARC_CHANNEL, INSTALL_TEMPLATES_CHANNEL, INSTALLED_ADDON_CHANNEL,
  UNINSTALL_ARC_CHANNEL,
  UNINSTALL_TEMPLATES_CHANNEL, UNINSTALLED_ADDON_CHANNEL
} from '../../../../IpcChannels';

const BASE_URI = 'https://www.deltaconnected.com/arcdps/x64/';
const ARC_DLL = 'd3d9.dll';
const TEMPLATES_DLL = 'd3d9_arcdps_buildtemplates.dll';

@Injectable()
export class ArcDpsService extends ComponentBase {

  private installPath: string;

  constructor(private http: HttpClient, private store: Store<AppState>,
              private electronService: ElectronService) {
    super();

    this.disposeOnDestroy(this.store.select(state => state.settings.installation_path)
      .subscribe(path => this.installPath = path)
    );

    this.electronService.ipcRenderer.on(INSTALLED_ADDON_CHANNEL, (event, addonkey, tag) => {
      const changes = {
        installed: true,
        installed_version: tag,
        latest_version: tag
      };
      this.store.dispatch(new Update(addonkey, changes))
    });

    this.electronService.ipcRenderer.on(UNINSTALLED_ADDON_CHANNEL, (event, addonkey) => {
      const changes = {
        installed: false,
        installed_version: '',
      };
      this.store.dispatch(new Update(addonkey, changes))
    });
  }

  public getArcLatestVersion(): Observable<string> {
    return this.getEtagVersion(`${BASE_URI}${ARC_DLL}`);
  }

  public getTemplatesLatestVersion(): Observable<string> {
    return this.getEtagVersion(`${BASE_URI}buildtemplates\\${TEMPLATES_DLL}`);
  }

  public installArc() {
    this.electronService.ipcRenderer.send(INSTALL_ARC_CHANNEL);
  }

  public removeArc() {
    this.electronService.ipcRenderer.send(UNINSTALL_ARC_CHANNEL);
  }

  public removeTemplates() {
    this.electronService.ipcRenderer.send(UNINSTALL_TEMPLATES_CHANNEL);
  }

  public installBuildTemplates() {
    this.electronService.ipcRenderer.send(INSTALL_TEMPLATES_CHANNEL);
  }

  private getEtagVersion(url: string) {
    return this.http.head(url, { observe: 'response', responseType: 'text' })
      .map(res => res.headers.get('etag'))
      .map(etag => etag.split('-gzip')[0])
      .map(str => str.replace(/["]+/g, ''))
  }


}
