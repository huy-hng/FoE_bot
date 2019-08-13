"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./functions/logging");
const auto_login_1 = require("./functions/auto_login");
const gui_1 = require("./initializers/gui");
const event_listener_1 = require("./event_listener");
const logging = new logging_1.default('Main');
async function on_load() {
    const logger = logging.get_logger('on_load', 'DEBUG', true);
    logger.debug('start on load');
    let webview = document.getElementById("webview");
    let loadstart = () => {
        console.log('loading...');
    };
    let loadstop = () => {
        console.log('done');
    };
    webview.addEventListener("loadstart", loadstart);
    webview.addEventListener("loadstop", loadstop);
}
async function start() {
    await on_load();
    await gui_1.initialize_gui();
    event_listener_1.start();
    auto_login_1.auto_login();
}
start();
