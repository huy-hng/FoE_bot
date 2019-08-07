const Logging = require("./logging");
const get_screenshot = require("./screenshot");
const python = require("./python_endpoints");
const logging_helpers = new Logging('helpers');
async function click_img(str_template, webview_data) {
    let logger = logging_helpers.get_logger('click_img', 'DEBUG');
    await get_screenshot("screen.png");
    let { scale, webview_region, roi_region } = webview_data;
    let { prob, coord } = await python.find_template(str_template, scale, webview_region, roi_region);
    logger.debug(str_template, prob, coord);
    if (prob > 0.8)
        await mouse_press(coord);
    return prob;
}
function mouse_press(coord) {
    let webview = document.getElementById("webview");
    let x = coord[0] * webview.clientWidth;
    let y = coord[1] * webview.clientHeight;
    webview.sendInputEvent({
        type: "mouseDown",
        x: x,
        y: y,
        button: "left",
        clickCount: 1
    });
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
exports.click_img = click_img;
