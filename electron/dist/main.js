"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./functions/logging");
const auto_login_1 = require("./functions/auto_login");
const gui_1 = require("./initializers/gui");
const event_listener_1 = require("./event_listener");
const logging = new logging_1.default('Main');
async function start() {
    await gui_1.initialize_gui();
    event_listener_1.start();
    let data = await auto_login_1.auto_login();
}
start();
