import { DEBUG_CHROME_CHANNEL, INSTALL_PATH_CHANNEL } from '../IpcChannels';
const ipcMain = require('electron').ipcMain;
const path = require('path');
const fs = require('fs');
const jsonfile = require('jsonfile');

const jsonFileName = 'addons.json';
const addons = {};

export class FileService {
  private installation_path: string;
  private json_path: string;

  constructor() { }

  public init(): void {
    ipcMain.on(INSTALL_PATH_CHANNEL, (event, new_path) => {
      this.installation_path = new_path;
      this.json_path = path.resolve(this.installation_path, 'bin64', jsonFileName);
    });
  }

  public updateAddonVersionJson(key: string, version: string) {
    addons[key] = version;

    jsonfile.writeFile(this.json_path, addons, function (err) {
      if (err) {
        console.log('Updating version error in json: ', err);
      }
    })
  }

  public removeAddonJson(key: string) {
    delete addons[key];

    jsonfile.writeFile(this.json_path, addons, function (err) {
      if (err) {
        console.log('Removing addon from json error: ', err);
      }
    })
  }

  public writeAddon(filepath, response, sender, channel, addonkey) {
    const tag = this.getEtagFromResponse(response);
    fs.writeFile(filepath, response.body, (save_err) => {
      if (save_err) {
        sender.send(DEBUG_CHROME_CHANNEL, 'File save error', save_err);
      } else {
        this.updateAddonVersionJson(addonkey, tag);
        sender.send(channel, addonkey, tag);
      }
    });
  }

  public deleteAddon(filepath, sender, channel, addonkey) {
    fs.unlink(filepath, (err) => {
      if (err) {
        sender.send(DEBUG_CHROME_CHANNEL, 'File delete error', err);
      } else {
        this.removeAddonJson(addonkey);
        sender.send(channel, addonkey);
      }
    })
  }

  private getEtagFromResponse(res) {
    return res.headers.etag.replace(/['"]+/g, '');
  }
}
