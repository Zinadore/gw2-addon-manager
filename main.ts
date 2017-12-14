import { app, BrowserWindow, screen, Menu } from 'electron';

const isDev = require('electron-is-dev');
const outputFile = require('fs-extra').outputFile;

let win, serve, ipcMain;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
ipcMain = require('electron').ipcMain;

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: size.width / 2,
    height: size.height / 2,
    center: true,
    frame: false,
    show: false,
    minWidth: size.width / 2,
    minHeight: size.height / 2,
  });

  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  // Remove the menu bar in production builds
  if (!serve) {
    Menu.setApplicationMenu(null);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

   if (isDev) {
    const { installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
  }
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('SAVE_FILE', (event, filepath, buffer) => {
    outputFile(filepath, buffer, err => {
      if (err) {
        event.sender.send('SAVE_FILE_ERROR', err.message, filepath);
      } else {
        event.sender.send('SAVE_FILE_SUCCESS', filepath);
        console.log('[Electron Main] Saved file: ', filepath);
      }
    })
  });

} catch (e) {
  // Catch Error
  // throw e;
  app.quit();
}
