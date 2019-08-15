"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
const screenshot_1 = require("./screenshot");
const python = require("./python_endpoints");
const logging = new logging_1.default('helpers');
async function click_img(template, webview_data, prop_threshold = 0.8) {
    let logger = logging.get_logger('click_img', 'INFO');
    let { scale, webview_region, roi_region } = webview_data;
    await screenshot_1.get_screenshot("screen.png");
    let { prob, coord } = await python.find_template(template, scale, webview_region, roi_region);
    logger.debug(template, prob, coord);
    if (prob > prop_threshold)
        await mouse_press(coord);
    return prob > prop_threshold;
}
exports.click_img = click_img;
async function mouse_press(coord) {
    let webview = document.getElementById("webview");
    let x = coord[0] * webview.clientWidth;
    let y = coord[1] * webview.clientHeight;
    //@ts-ignore
    webview.sendInputEvent({
        type: "mouseDown",
        x: x,
        y: y,
        button: "left",
        clickCount: 1
    });
    //@ts-ignore
    webview.sendInputEvent({
        type: "mouseUp",
        x: x,
        y: y,
        button: "left",
        clickCount: 1
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
