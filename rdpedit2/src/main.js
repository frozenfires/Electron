const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const electronLocalshortcut = require('electron-localshortcut');
const ipcMain = electron.ipcMain;
const path = require('path');
const url = require('url');
const dialog = electron.dialog;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  createWindow();
  electronLocalshortcut.register(mainWindow, 'Control+F12', function(){
    var focuseWindow = BrowserWindow.getFocusedWindow();
    if(focuseWindow){
      focuseWindow.webContents.openDevTools();
    }
  });
  electronLocalshortcut.register(mainWindow, 'F11', function(event, cmdtype, arg){
    mainWindow.webContents.send('open_tab_tool', arg);
  });

  ipcMain.on('viewEvent', viewEvent);
  ipcMain.on('tabEvent', tabEvent);
  // ipcMain.on('open-file-dialog', openFileDialogEvent);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function viewEvent(event, cmdtype, arg) {
  console.info(event);
  console.info(cmdtype);
  console.info(arg);

  // mainWindow.webContents.executeJavaScript('document.getElementById("'+arg+'").click()');
  mainWindow.webContents.send('cmd_view_open', arg);
}

function tabEvent(event, cmdtype, arg) {
  console.info(event);
  console.info(cmdtype);
  console.info(arg);
  mainWindow.webContents.send(cmdtype, arg);
}

/*
function openFileDialogEvent(event, cmdtype, arg) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (file) {
    if (file) mainWindow.webContents.send('selected-file', file);
    // event.sender.send('selected-file', file)

  })
}*/