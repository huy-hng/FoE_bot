"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_data_1 = require("../functions/process_data");
const logging_1 = require("../functions/logging");
const logging = new logging_1.default('Initialize Gui');
async function initialize_gui() {
    const logger = logging.get_logger('initialize_gui', 'INFO', true);
    const app_data = new process_data_1.default('app');
    let data = await app_data.get_data();
    logger.debug(data);
    logger.debug(typeof data);
    //@ts-ignore
    document.getElementById('auto_login').checked = data.auto_login;
    //@ts-ignore
    document.getElementById('server').value = data.auto_login_server;
}
exports.initialize_gui = initialize_gui;
