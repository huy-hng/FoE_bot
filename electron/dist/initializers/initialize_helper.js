"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const logging_1 = require("../functions/logging");
const python = require("../functions/python_endpoints");
const helpers = require("../functions/helpers");
const logging = new logging_1.default('InitializeHelper');
class InitializeHelper extends base_1.default {
    async start() {
        let logger = logging.get_logger('main', 'INFO', true);
        logger.debug();
        let webview_region = await this.get_webview_region();
        let scale = await this.get_scale(webview_region, 'in_game');
        logger.debug('scale', scale);
        if (scale) {
            let roi_region = await this.get_roi_region(webview_region, scale);
            logger.info('Finished Initialization');
            return { success: true, scale, webview_region, roi_region };
        }
        else {
            logger.info('Initialization Failed');
            return { success: false, message: 'You need to log in.' };
        }
    }
    async get_roi_region(webview_region, scale) {
        let logger = logging.get_logger('get_roi_region', 'DEBUG', true);
        logger.debug(`args: ts.scale = ${scale}, webview_region = ${webview_region}`);
        let roi_on_screen = await python.check_roi_on_screen(scale, webview_region);
        if (roi_on_screen == 0.5) {
            // press up arrow
            await get_screenshot("screen.png");
            let { prob, coord } = await python.find_template('navigation/up', scale, webview_region);
            if (prob > 0.8)
                await mouse_press(coord);
            logger.info('waiting');
            await helpers.sleep(2000);
        }
        else if (roi_on_screen == 0)
            throw new Error('Something is wrong');
        await get_screenshot("screen.png");
        let roi_region = await python.get_roi_region(scale, webview_region);
        logger.debug(roi_region);
        return roi_region;
    }
}
exports.default = InitializeHelper;
