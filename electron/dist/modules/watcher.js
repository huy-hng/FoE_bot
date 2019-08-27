"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python = require("../functions/python_endpoints");
const logging_1 = require("../functions/logging");
const base_1 = require("../initializers/base");
const process_data_1 = require("../functions/process_data");
const logging = new logging_1.default('watcher');
const helper_data = new process_data_1.default('helper');
async function initialize() {
    const logger = logging.get_logger('initialize', 'DEBUG', true);
    const initialize = new base_1.default();
    let webview_data = await initialize.start('./ereignis_uebersicht/top_right_ereignis_ubersicht');
    logger.debug('webview_data', webview_data);
    if (!webview_data.scale)
        return false;
    return webview_data;
}
async function main() {
    const logger = logging.get_logger('main', 'DEBUG', true);
    let webview_data = await initialize();
    let data;
    if (webview_data) {
        data = await python.get_names(webview_data.scale, webview_data.webview_region);
    }
    else {
        logger.warn('Ereignis uebersicht not open');
    }
    logger.debug('data:', data);
    // let data = await helper_data.get_data() 
    // if (Object.keys(data.potential_helpers).length == 0) {
    //   // initialize potential helpers
    //   data = get_all_potential_helpers(data)
    //   helper_data.set_data(data)
    // }
    // data = get_all_helpers(data)
}
exports.main = main;
async function get_all_helpers(data) {
    let { scale, webview_region } = data;
    let helpers_loc = await python.find_all_template_locations('ereignis_uebersicht/golden_star', scale, webview_region);
    let helpers_names = await get_names(helpers_loc);
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
