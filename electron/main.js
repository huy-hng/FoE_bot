const path = require("path");
const url = require("url");

const { app, BrowserWindow } = require("electron");

require("electron-reload")(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`),
  ignored: /screen.png|index.html/,
  argv: []
});

const { Menu, MenuItem } = require('electron');



function createWindow() {
  let win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: { webviewTag: true, nodeIntegration: true }
  });
  // win.removeMenu();
  win.maximize();

  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'Pause',
    accelerator: 'p',
    click: () => { console.log('time to print stuff') }
  }))
  
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);
