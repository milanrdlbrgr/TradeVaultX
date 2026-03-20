const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  const htmlPath = app.isPackaged 
    ? path.join(process.resourcesPath, 'TradeVaultX.html')
    : path.join(__dirname, 'TradeVaultX.html');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    show: false,
  });

  console.log('Loading from:', htmlPath);
  mainWindow.loadURL(`file://${htmlPath}`).catch(err => {
    console.log('Error:', err);
    mainWindow.loadURL('data:text/html,<h1>Path: ' + htmlPath + '</h1>');
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  checkForUpdates();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update verfügbar',
      message: 'Eine neue Version von TradeVaultX ist verfügbar. Sie wird jetzt heruntergeladen.',
      buttons: ['OK']
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update bereit',
      message: 'Update wurde heruntergeladen. TradeVaultX wird jetzt neu gestartet.',
      buttons: ['Jetzt neu starten']
    }).then(() => {
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (err) => {
    console.log('Auto-updater error:', err);
  });
}
