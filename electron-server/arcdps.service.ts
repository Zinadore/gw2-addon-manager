import {
  DEBUG_CHROME_CHANNEL, INSTALL_ARC_CHANNEL,
  INSTALL_PATH_CHANNEL, INSTALL_TEMPLATES_CHANNEL, INSTALLED_ADDON_CHANNEL,
  UNINSTALL_ARC_CHANNEL, UNINSTALL_TEMPLATES_CHANNEL, UNINSTALLED_ADDON_CHANNEL
} from '../IpcChannels';
import { FileService } from './file.service';
import { AvailableAddons } from '../src/app/addons/models/addon';

const ipcMain = require('electron').ipcMain;
const httpreq = require('httpreq');
const path = require('path');

const BASE_URI = 'https://www.deltaconnected.com/arcdps/x64/';
const ARC_DLL = 'd3d9.dll';
const TEMPLATES_DLL = 'd3d9_arcdps_buildtemplates.dll';

const sslRootCAs = require('ssl-root-cas/latest');
sslRootCAs.inject();

export class ArcDpsService {
  private installation_path: string;
  private bin_path: string;
  constructor(private fService: FileService) {

  }

  public setUp(): void {
    ipcMain.on(INSTALL_ARC_CHANNEL, (event) => {
      const dllPath = path.resolve(this.bin_path, ARC_DLL);
      httpreq.get(`${BASE_URI}${ARC_DLL}`, {binary: true, rejectUnauthorized: false}, (err, res) => {
        if (err) {
          event.sender.send(DEBUG_CHROME_CHANNEL, 'download error', err);
        } else {
          this.fService.writeAddon(dllPath, res, event.sender, INSTALLED_ADDON_CHANNEL, AvailableAddons.ArcDPS);
        }
      });
    });

    ipcMain.on(INSTALL_TEMPLATES_CHANNEL, (event) => {
      const dllPath = path.resolve(this.bin_path, TEMPLATES_DLL);
      httpreq.get(`${BASE_URI}buildtemplates/${TEMPLATES_DLL}`, {binary: true, rejectUnauthorized: false}, (err, res) => {
        if (err) {
          event.sender.send(DEBUG_CHROME_CHANNEL, 'download error', err);
        } else {
          event.sender.send(DEBUG_CHROME_CHANNEL, 'Downloaded dll', res);
          this.fService.writeAddon(dllPath, res, event.sender, INSTALLED_ADDON_CHANNEL, AvailableAddons.BuildTemplates);
        }
      });
    });

    ipcMain.on(UNINSTALL_ARC_CHANNEL, (event) => {
      const dllPath = path.resolve(this.bin_path, ARC_DLL);
      this.fService.deleteAddon(dllPath, event.sender, UNINSTALLED_ADDON_CHANNEL, AvailableAddons.ArcDPS);
    });

    ipcMain.on(UNINSTALL_TEMPLATES_CHANNEL, (event) => {
      const dllPath = path.resolve(this.bin_path, TEMPLATES_DLL);
      this.fService.deleteAddon(dllPath, event.sender, UNINSTALLED_ADDON_CHANNEL, AvailableAddons.BuildTemplates);
    });

    ipcMain.on(INSTALL_PATH_CHANNEL, (event, new_path) => {
      this.installation_path = new_path;
      this.bin_path = path.resolve(this.installation_path, 'bin64');
    });
  }
}
