"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const screenshot_1 = require("../functions/screenshot");
const logging_1 = require("../functions/logging");
const python = require("../functions/python_endpoints");
const logging = new logging_1.default('Base Initialize');
class Initialize {
    async get_webview_region() {
        let logger = logging.get_logger('get_webview_region', 'INFO', true);
        logger.debug();
        document.getElementById('webview').style.borderColor = "rgba(0, 255, 0, 1)";
        await screenshot_1.get_screenshot("screen.png");
        document.getElementById('webview').style.borderColor = "rgb(0, 255, 0, 0)";
        let webview_region = await python.get_webview_region();
        logger.debug('webview_region', JSON.stringify(webview_region));
        return webview_region;
    }
    async get_scale(webview_region, template) {
        let scale = await python.get_scale(webview_region, template);
        return scale;
    }
}
exports.default = Initialize;
