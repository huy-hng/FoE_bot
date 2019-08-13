"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initialize_auto_login_1 = require("../initializers/initialize_auto_login");
const helpers = require("./helpers");
const logging_1 = require("./logging");
const logging = new logging_1.default('auto_login');
const logger = logging.get_logger('', 'INFO', true);
async function auto_login() {
    if (!should_auto_login()) {
        logger.info('Skipping auto login');
        return;
    }
    await wait_loading();
    //@ts-ignore
    let server = document.getElementById('server').value;
    logger.debug('server:', server);
    const initialize = new initialize_auto_login_1.default(server);
    let data = await initialize.start();
    logger.debug('data:', data);
    if (data.success) {
        logger.info('Successfully logged in');
    }
    else {
        logger.info('Failed auto login');
    }
    return data;
}
exports.auto_login = auto_login;
function should_auto_login() {
    //@ts-ignore
    let auto_login = document.getElementById('auto_login').checked;
    logger.debug('auto_login:', auto_login);
    return auto_login;
}
async function wait_loading() {
    let loading = true;
    document.getElementById('webview')
        .addEventListener("did-stop-loading", () => loading = false);
    while (loading) {
        await helpers.sleep(10);
    }
}
