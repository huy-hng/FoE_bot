const path = require("path");
const url = require("url");

const electron = require('electron');
const { app, BrowserWindow } = electron;

const { Menu, MenuItem } = electron;

// require("electron-reload")(__dirname, {
//   electron: require(`${__dirname}/node_modules/electron`),
//   ignored: /.png|.log/,
//   // ignored: /screen.png|index.html/,
//   argv: [],
//   hardResetMethod: 'exit',
// });

process.env.NODE_ENV = 'development'

function createWindow() {
  let win = new BrowserWindow({
    minWidth:1200,
    width: 1920,
    minHeight:675,
    height: 1080,
    webPreferences: { webviewTag: true, nodeIntegration: true }
  });

  win.removeMenu();
  win.maximize();
  
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
