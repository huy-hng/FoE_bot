"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const logging_1 = require("../logging");
const helpers = require("../helpers");
const logging = new logging_1.default('initialize');
class InitializeAutoLogin extends base_1.default {
    async start() {
        let logger = logging.get_logger('main', 'INFO', true);
        logger.debug();
        let webview_region = await this.get_webview_region();
        let scale = await this.get_scale(webview_region, 'spielen_text');
        logger.debug('scale', scale);
        let message;
        if (scale) {
            logger.info('Finished Initialization');
            await helpers.click_img('spielen_text', {});
            return { success: true, scale, webview_region };
        }
        else {
            logger.info('Finished Initialization');
            return { success: false, message: 'Auto login failed' };
        }
    }
}
exports.default = InitializeAutoLogin;
