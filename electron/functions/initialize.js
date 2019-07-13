const get_screenshot = require("./screenshot");
const spawn_python = require("./spawn_python");
const sleep = require("./sleep");


const Logging = require("./logging");
const logging_initialize = new Logging('initialize');

async function initialize() {
  logger = logging_initialize.get_logger('main', 'info', true, true)

  let webview_region = await get_webview_region();


  let scale = await spawn_python("get_scale_and_check_logged_in", webview_region);
  logger.debug('scale', scale)
  
  let roi_region;
  let message;
  if (scale) {
    roi_region = await get_roi_region(scale, webview_region)
  } else {
    message = 'You need to log in.'
  }

  logger.info('Finished Initialization')

  return { scale, webview_region, roi_region, message}
}

async function get_webview_region() {
  logger = logging_initialize.get_logger('get_webview_region', 'info', true, true)

  document.getElementById('webview').style.borderColor = "rgba(0, 255, 0, 1)"
  await get_screenshot("screen.png");
  document.getElementById('webview').style.borderColor = "rgb(0, 255, 0, 0)"
  let webview_region = await spawn_python("get_webview_region");

  logger.debug('webview_region', JSON.stringify(webview_region))
  return webview_region
}

async function get_roi_region(scale, webview_region) {
  logger = logging_initialize.get_logger('get_roi_region', 'debug', true, true)

  let roi_on_screen = await spawn_python("check_roi_on_screen", scale, webview_region);
  if (roi_on_screen == 0.5) {
    // press up arrow
    await get_screenshot("screen.png");
    let { prob, coord } = await spawn_python("find_template", 'navigation/up', scale, webview_region);
    if (prob > 0.8) await mouse_press(coord)
    logger.info('waiting');  
    await sleep(2000);
    
  } else if (roi_on_screen == 0) {
    return 'something is wrong';
  }
  
  await get_screenshot("screen.png");
  let roi_region = await spawn_python("get_roi_region", scale, webview_region);

  logger.debug(roi_region)
  return roi_region
}

module.exports = initialize;