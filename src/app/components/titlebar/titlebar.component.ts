import { Component, HostListener, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import * as path from 'path';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  private window: any;

  public images = {
    minimize: '',
    maximize: '',
    restore: '',
    close: '',
    gw2_logo: ''
  };

  public canMinimize: boolean;
  public canMaximize: boolean;
  public isMaximized: boolean;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron()) {
      this.window = window.require('electron').remote.getCurrentWindow();
      this.images.minimize = 'file://' + path.resolve(this.electronService.assetsPath, 'caption-buttons.svg#minimize');
      this.images.maximize = 'file://' + path.resolve(this.electronService.assetsPath, 'caption-buttons.svg#maximize');
      this.images.restore = 'file://' + path.resolve(this.electronService.assetsPath, 'caption-buttons.svg#restore');
      this.images.close = 'file://' + path.resolve(this.electronService.assetsPath, 'caption-buttons.svg#close');
      this.images.gw2_logo = 'file://' + path.resolve(this.electronService.assetsPath, 'gw2-logo.png');
    }
  }

  ngOnInit() {
    this.canMaximize = this.window.isResizable() || this.window.isMaximizable();
    this.canMinimize = this.window.isMinimizable();
    this.isMaximized = false;
  }

  public close(): void {
    if (this.window) {
      this.window.close();
    }
  }

  public minimize(): void {
    console.log('minimizing window');
    if (this.window) {
      this.window.minimize();
    }
  }

  public maximize(): void {
    console.log('maximizing window');
    if (this.window) {
      this.isMaximized = true;
      this.window.maximize();
    }
  }

  public restore(): void {
    console.log('restoring widnow');
    if (this.window) {
      this.isMaximized = false;
      this.window.restore();
    }
  }
}
