"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const electron_1 = require("electron");
const path = require("path");
require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/../node_modules/electron`),
    ignored: /.png|.log/,
    // ignored: /screen.png|index.html/,
    argv: [],
    hardResetMethod: 'exit',
});
process.env.NODE_ENV = 'd';
function createWindow() {
    let win = new electron_1.BrowserWindow({
        minWidth: 1200,
        width: 1920,
        minHeight: 675,
        height: 1080,
        webPreferences: { webviewTag: true, nodeIntegration: true }
    });
    win.removeMenu();
    win.maximize();
    win.loadURL(url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true
    }));
    /* if (process.env.NODE_ENV == 'd') */ win.webContents.openDevTools();
    win.on("closed", () => {
        win = null;
    });
}
electron_1.app.on("ready", createWindow);
