import { BrowserWindow } from 'electron';
const DEBUG_STRING = '[DEBUG Chrome Log]';

export class LoggingService {
  constructor(private mainWindow: typeof BrowserWindow) {

  }

  public logToChrome(data: any) {
    // this.mainWindow.window.webContents.send(DEBUG_STRING, data);
  }
}
