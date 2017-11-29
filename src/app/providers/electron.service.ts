import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';
import * as settings from 'electron-settings';
import * as path from 'path';

@Injectable()
export class ElectronService {
  private _assetsPath: string;

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  settings: typeof settings;
  path: typeof  path;

  get assetsPath(): string {
    return this._assetsPath;
  }
  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
      this.settings = window.require('electron-settings');
      this.path = window.require('path');
      this._assetsPath = path.resolve(__dirname, 'assets');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  fromSettings(key: string): any {
    return this.settings.get(key);
  }

  hasSetting(key: string): boolean {
    return this.settings.has(key);
  }

  setSetting(key: string, value: any): void {
    this.settings.set(key, value);
  }
}
