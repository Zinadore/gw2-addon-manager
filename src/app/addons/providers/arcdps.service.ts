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
import { FileSystemService } from '../../providers/filesystem.service';
import { Update } from '../addons.actions';
import { AvailableAddons } from '../models/addon';
import { Subscription } from 'rxjs/Subscription';

const BASE_URI = 'https://www.deltaconnected.com/arcdps/x64/';
const ARC_DLL = 'd3d9.dll';
const TEMPLATES_DLL = 'd3d9_arcdps_buildtemplates.dll';

@Injectable()
export class ArcDpsService extends ComponentBase {

  private installPath: string;
  private arcSub: Subscription;
  private templateSub: Subscription;

  constructor(private http: HttpClient, private store: Store<AppState>,
              private fs: FileSystemService) {
    super();

    this.disposeOnDestroy(this.store.select(state => state.settings.installation_path)
      .subscribe(path => this.installPath = path)
    );
  }

  public getArcLatestVersion(): Observable<string> {
    return this.getEtagVersion(`${BASE_URI}${ARC_DLL}`);
  }

  public getTemplatesLatestVersion(): Observable<string> {
    return this.getEtagVersion(`${BASE_URI}buildtemplates\\${TEMPLATES_DLL}`);
  }

  public installArc() {
    if (this.arcSub) {
      this.arcSub.unsubscribe();
    }
    const get = this.http.get(`${BASE_URI}${ARC_DLL}`, { observe: 'response', responseType: 'blob'});

    const tag$ = get.map(res => res.headers.get('etag'))
      .map(etag => etag.split('-gzip')[0])
      .map(str => str.replace(/["]+/g, ''));
    let filepath;
    const save$ = get.map(res => res.body)
      .switchMap(dll => {
        filepath = this.fs.path.resolve(this.installPath, 'bin64', ARC_DLL);
        return this.fs.writeDllFromBlob(filepath, dll);
      });

    this.arcSub = tag$.combineLatest(save$)
      .subscribe((value) => {

        const changes = {
          installed: value[1],
          installed_version: value[0],
          latest_version: value[0]
        };
        const jsonPath = this.fs.path.resolve(this.installPath, 'bin64', 'addons.json');
        this.fs.updateAddonVersionInJson(jsonPath, AvailableAddons.ArcDPS, value[0]);
        this.store.dispatch(new Update(AvailableAddons.ArcDPS, changes))
      });
  }

  public removeArc() {
    this.removeAddon(AvailableAddons.ArcDPS, ARC_DLL);
  }

  public removeTemplates() {
    this.removeAddon(AvailableAddons.BuildTemplates, TEMPLATES_DLL);
  }

  private removeAddon(addonId: string, dllname: string) {
    const dllpath = this.fs.path.resolve(this.installPath, 'bin64', dllname);
    const jsonpath = this.fs.path.resolve(this.installPath, 'bin64', 'addons.json');

    if (this.fs.deleteFile(dllpath)) {
      this.fs.removeAddonFromJson(jsonpath, addonId);
      this.store.dispatch(new Update(addonId, { installed: false, installed_version: 'none' }))
    }
  }

  public installBuildTemplates() {
    if (this.templateSub) {
      this.templateSub.unsubscribe();
    }
    const get = this.http.get(`${BASE_URI}buildtemplates\\${TEMPLATES_DLL}`, { observe: 'response', responseType: 'blob'});

    const tag$ = get.map(res => res.headers.get('etag'))
      .map(etag => etag.split('-gzip')[0])
      .map(str => str.replace(/["]+/g, ''));

    const save$ = get.map(res => res.body)
      .switchMap(dll => {
        const filePath = this.fs.path.resolve(this.installPath, 'bin64', TEMPLATES_DLL);
        return this.fs.writeDllFromBlob(filePath, dll);
      });

    this.arcSub = tag$.combineLatest(save$)
      .subscribe((value) => {

        const changes = {
          installed: value[1],
          installed_version: value[0],
          latest_version: value[0]
        };
        const jsonPath = this.fs.path.resolve(this.installPath, 'bin64', 'addons.json');
        this.fs.updateAddonVersionInJson(jsonPath, AvailableAddons.BuildTemplates, value[0]);
        this.store.dispatch(new Update(AvailableAddons.BuildTemplates, changes))
      });
  }

  private getEtagVersion(url: string) {
    return this.http.head(url, { observe: 'response', responseType: 'text' })
      .map(res => res.headers.get('etag'))
      .map(etag => etag.split('-gzip')[0])
      .map(str => str.replace(/["]+/g, ''))
  }


}
