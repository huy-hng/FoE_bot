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
        let logger = logging.get_logger('main', 'INFO', true);
        logger.debug();
        let webview_region = await this.get_webview_region();
        let scale = await this.get_scale(webview_region, 'spielen_text');
        logger.debug('scale', scale);
        if (scale) {
            await helpers.click_img('spielen_text', { scale, webview_region });
            await helpers.click_img(`servers/${this.server}`, { scale, webview_region });
            logger.info('Finished Initialization');
            return { success: true, scale, webview_region };
        }
        else {
            logger.info('Finished Initialization');
            return { success: false, message: 'Auto login failed' };
        }
    }
}
exports.default = InitializeAutoLogin;
