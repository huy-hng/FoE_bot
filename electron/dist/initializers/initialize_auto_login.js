"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const logging_1 = require("../functions/logging");
const helpers = require("../functions/helpers");
const logging = new logging_1.default('InitializeAutoLogin');
class InitializeAutoLogin extends base_1.default {
    constructor(server) {
        super();
        this.server = server;
    }
    async start() {
        let logger = logging.get_logger('start', 'INFO', true);
        let { scale, webview_region } = await super.start('spielen_text');
        let success = false;
        let message;
        if (scale) {
            let play = await helpers.click_img('spielen_text', { scale, webview_region });
            let server = await helpers.click_img(`servers/${this.server}`, { scale, webview_region });
            logger.debug('play:', play);
            logger.debug('server:', server);
            if (play && server) {
                success = true;
            }
            else if (!play) {
                message = "Couldn't find play button";
            }
            else if (play && !server) {
                message = "Couldn't find server";
            }
        }
        message = 'Finished Initialization';
        return { success, scale, webview_region, message };
    }
}
exports.default = InitializeAutoLogin;
