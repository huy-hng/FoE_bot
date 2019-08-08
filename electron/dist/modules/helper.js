"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initialize_helper_1 = require("../initializers/initialize_helper");
const screenshot_1 = require("../functions/screenshot");
const logging_1 = require("../functions/logging");
const python = require("../functions/python_endpoints");
const helpers = require("../functions/helpers");
const logging = new logging_1.default('helper');
async function initialize() {
    let logger = logging.get_logger('initialize', 'info', true);
    let initialize = new initialize_helper_1.default();
    let data = await initialize.start();
    logger.debug('data', data);
    if (data.success) {
        return data;
    }
    console.log(data.message);
    return false;
}
async function start() {
    let logger = logging.get_logger('start', 'info', true);
    const webview_data = await initialize();
    if (!webview_data)
        return;
    const checkboxes = ['friends help', 'friends tavern',
        'guild help', 'neighbors help'];
    show_buttons(true);
    for (const str of checkboxes) {
        if (document.getElementById(str).checked) {
            let tab = str.split(' ')[0];
            let action = str.split(' ')[1];
            logger.info(action, tab);
            await click_all_images(tab, action, webview_data);
            await should_pause();
            if (stop) {
                toggle_stop();
                console.log('Stopped');
                show_buttons(false);
                return;
            }
        }
    }
    console.log('Finished everything');
    show_buttons(false);
}
exports.start = start;
function show_buttons(show) {
    let start;
    let rest;
    if (show) {
        start = 'none';
        rest = 'flex';
    }
    else {
        start = 'flex';
        rest = 'none';
    }
    document.getElementById('start_button').style.display = start;
    document.getElementById('pause_button').style.display = rest;
    document.getElementById('stop_button').style.display = rest;
}
async function click_all_images(tab, str_template, webview_data) {
    let logger = logging.get_logger('click_all_images', 'info', true);
    logger.debug();
    await helpers.click_img(`helping/${tab}`, webview_data);
    await helpers.click_img('navigation/first', webview_data);
    await helpers.sleep(2000);
    let last_page_prob = 0;
    while (last_page_prob < 0.9) {
        let loop_count = await click_images_in_page(`helping/${str_template}`, webview_data);
        logger.debug('loop_count', loop_count);
        if (loop_count < 2) {
            last_page_prob = await check_last_page(webview_data);
        }
        else {
            await helpers.click_img("navigation/next", webview_data);
        }
        await should_pause();
        if (stop) {
            return;
        }
    }
    console.log(`Finished ${tab} ${str_template}`);
}
async function click_images_in_page(str_template, webview_data) {
    let help_prob = 1;
    let loop_count = 0;
    while (help_prob > 0.8) {
        help_prob = await helpers.click_img(str_template, webview_data);
        await should_pause();
        if (stop) {
            return;
        }
        loop_count++;
    }
    console.log('Page finished.');
    return loop_count;
}
async function check_last_page(webview_data) {
    await helpers.click_img("navigation/next", webview_data);
    await screenshot_1.get_screenshot("next_screen.png");
    // let prob = await spawn_python("check_last_page", webview_data.webview_region, webview_data.roi_region);
    let prob = await python.check_last_page(webview_data);
    return prob;
}
//#region helper
async function timer(fn, ...args) {
    let t0 = performance.now();
    let output = await fn(args);
    let t1 = performance.now();
    // console.log(`${fn.name} took ${t1 - t0} seconds.`);
    console.log(`${fn.name} took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);
    return output;
}
//endregion
//#region pause / stop
let paused = false;
let stop = false;
function toggle_pause() {
    paused = !paused;
}
exports.toggle_pause = toggle_pause;
function toggle_stop() {
    stop = !stop;
    if (stop)
        console.log('Stopping');
}
exports.toggle_stop = toggle_stop;
async function should_pause() {
    if (paused) {
        document.getElementById('pause_button').innerHTML = 'Unpause';
        console.log('Paused.');
        while (paused) {
            await helpers.sleep(500);
            if (stop) {
                break;
            }
        }
        document.getElementById('pause_button').innerHTML = 'Pause';
        console.log('Unpaused.');
    }
}
//#endregion
