"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const logging_1 = require("../functions/logging");
const screenshot_1 = require("../functions/screenshot");
const python = require("../functions/python_endpoints");
const helpers = require("../functions/helpers");
const logging = new logging_1.default('InitializeHelper');
class InitializeHelper extends base_1.default {
    async start() {
        const logger = logging.get_logger('start', 'INFO', true);
        let { scale, webview_region } = await super.start('in_game');
        let roi_region;
        if (scale) {
            roi_region = await this.get_roi_region(scale, webview_region);
            logger.info('Finished Initialization');
        }
        else {
            throw logger.error('No scale value');
        }
        return { scale, webview_region, roi_region };
    }
    async get_roi_region(scale, webview_region) {
        const logger = logging.get_logger('get_roi_region', 'DEBUG', true);
        logger.debug(`args: ts.scale = ${scale}, webview_region = ${webview_region}`);
        let roi_on_screen = await python.check_roi_on_screen(scale, webview_region);
        if (roi_on_screen == 0.5) {
            // press up arrow
            helpers.click_img('navigation/up', { scale, webview_region });
            await helpers.sleep(2000);
        }
        else if (roi_on_screen == 0)
            throw logger.error("Couldn't get roi_region");
        await screenshot_1.get_screenshot("screen.png");
        let roi_region = await python.get_roi_region(scale, webview_region);
        logger.debug(roi_region);
        return roi_region;
    }
}
exports.default = InitializeHelper;
