"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn_python_1 = require("./spawn_python");
async function find_template(template, scale, webview_region, roi_region) {
    let { prob, coord } = await spawn_python_1.spawn_python("find_template", template, scale, webview_region, roi_region);
    return { prob, coord };
}
exports.find_template = find_template;
async function check_last_page(webview_data) {
    let { webview_region, roi_region } = webview_data;
    let prob = await spawn_python_1.spawn_python("check_last_page", webview_region, roi_region);
    return prob;
}
exports.check_last_page = check_last_page;
//#region initialize
async function get_scale(webview_region, template) {
    let scale = await spawn_python_1.spawn_python("get_scale", webview_region, template);
    return scale;
}
exports.get_scale = get_scale;
async function get_webview_region() {
    let webview_region = await spawn_python_1.spawn_python("get_webview_region");
    return webview_region;
}
exports.get_webview_region = get_webview_region;
async function check_roi_on_screen(scale, webview_region) {
    let roi_on_screen = await spawn_python_1.spawn_python("check_roi_on_screen", scale, webview_region);
    return roi_on_screen;
}
exports.check_roi_on_screen = check_roi_on_screen;
async function get_roi_region(scale, webview_region) {
    let roi_region = await spawn_python_1.spawn_python("get_roi_region", scale, webview_region);
    return roi_region;
}
exports.get_roi_region = get_roi_region;
//#endregion
