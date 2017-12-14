import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

import * as fs from 'mz/fs';
import * as path from 'path';
import { ipcRenderer } from 'electron';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileSystemService {

  private _fs: typeof fs;
  private _path: typeof path;
  private _ipcRenderer: typeof ipcRenderer;

  private pendingSaves: Map<string, Subject<boolean>>;

  get path(): typeof path {
    return this._path;
  }

  constructor(private electronService: ElectronService) {
    this.pendingSaves = new Map<string, Subject<boolean>>();
    if (this.electronService.isElectron()) {
      this._fs = window.require('mz/fs');
      this._path = window.require('path');
      this._ipcRenderer = window.require('electron').ipcRenderer;

      this._ipcRenderer.on('SAVE_FILE_ERROR', (event, error, filepath) => {
        this.electronService.remote.dialog.showErrorBox(`Error saving: ${filepath}`, error);
        const subject = this.pendingSaves[filepath];
        this.pendingSaves.delete(filepath);
        subject.next(false);
      });

      this._ipcRenderer.on('SAVE_FILE_SUCCESS', (event, filepath) => {
        console.log('Save file success for', filepath);
        const subject = this.pendingSaves[filepath];
        this.pendingSaves.delete(filepath);
        subject.next(true);
      });
    }
  }

  public fileExists(filepath: string): Promise<boolean> {
    return this._fs.exists(filepath);
  }

  public deleteFile(filepath: string): boolean {
    if (this._fs.existsSync(filepath)) {
      this._fs.unlink(filepath);
      return true;
    }
    return false;
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

  public writeDllFromBlob(filepath: string, blob: any): Observable<boolean> {
    const reader = new FileReader();
    const self = this;
    reader.onload = function() {
      if (reader.readyState === 2) {
        const buffer = new Buffer(reader.result);
        self._ipcRenderer.send('SAVE_FILE', filepath, buffer);
        // console.log(`Saving ${JSON.stringify({ filepath, size: blob.size })}`)
      }
    };
    reader.readAsArrayBuffer(blob);

    // Create an subject and return it as an observable.
    // The caller of the method can use the subject to track if
    // saving succeeded or failed
    const subject =  new Subject<boolean>();
    this.pendingSaves[filepath] = subject;
    return subject.asObservable();
  }

  public updateAddonVersionInJson(filepath: string, addonId: string, version: string) {

    this.loadJsonFile(filepath)
      .then(obj => {
        obj[addonId] = version;
        return obj;
      })
      .then(obj => {
        this.writeToJsonFile(filepath, obj);
      })
  }

  public removeAddonFromJson(filepath: string, addonId: string) {
    this.loadJsonFile(filepath)
      .then(obj => {
        delete obj[addonId];
        return obj
      })
      .then(obj => this.writeToJsonFile(filepath, obj));
  }

}
