"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python = require("../functions/python_endpoints");
const logging_1 = require("../functions/logging");
const base_1 = require("../initializers/base");
const process_data_1 = require("../functions/process_data");
const logging = new logging_1.default('watcher');
const helper_data = new process_data_1.default('helper');
async function initialize() {
    let logger = logging.get_logger('initialize', 'info', true);
    const initialize = new base_1.default();
    let webview_data = await initialize.start();
    logger.debug('webview_data', webview_data);
    if (!webview_data.scale)
        return false;
    return webview_data;
}
async function main() {
    let data = helper_data.get_data;
    if (Object.keys(data.potential_helpers).length == 0) {
        data = get_all_potential_helpers(data);
    }
    data = get_all_helpers(data);
    save_data(data);
}
async function get_all_helpers(data) {
    let helpers_loc = python.find_all_templates('ereignis_uebersicht/golden_star', scale, webview_region);
    let helpers_names = get_names(helpers_loc);
    for (let name of helpers_names) {
        if ((name in data.helpers)) {
            data.helpers.name.push();
        }
    }
    return data;
}
async function get_names(helper_loc) {
    return {};
}
async function get_all_potential_helpers(data) {
    return data;
}
