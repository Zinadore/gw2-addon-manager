import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

import * as fs from 'mz/fs';
import * as path from 'path';
import { ipcRenderer } from 'electron';

@Injectable()
export class FileSystemService {

  private _fs: typeof fs;
  private _path: typeof path;
  private _ipcRenderer: typeof ipcRenderer;

  get path(): typeof path {
    return this._path;
  }

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron()) {
      this._fs = window.require('mz/fs');
      this._path = window.require('path');
      this._ipcRenderer = window.require('electron').ipcRenderer;
    }
  }

  public fileExists(filepath: string): Promise<boolean> {
    return this._fs.exists(filepath);
  }

  public loadJsonFile(filepath: string): Promise<any> {
    return this._fs.readFile(filepath, 'utf8').then(data => {
      return JSON.parse(data)
    });
  }

  public writeToJsonFile(filepath: string, content: any): void {
    const json_string = JSON.stringify(content);
    this._fs.writeFileSync(filepath, json_string, 'utf8');
  }
}
