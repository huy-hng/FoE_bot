const spawn_python = require("../functions/spawn_python");
const mouse_press = require("../functions/mouse_press");
const get_screenshot = require("../functions/screenshot");
const sleep = require("../functions/sleep");
const Logging = require("../functions/logging");
const initializer = require("../functions/initialize")

const logging = new Logging('helper')

async function initialize() {
  let logger = logging.get_logger('initialize', 'debug', true, true)
  let webview_data = await initializer();
  logger.debug('webview_data', webview_data)
  if (webview_data.message) {
    console.log(webview_data.message);
    return false;
  }
  
  let coords = get_button_coords();
  return coords
}


async function check_build_mode() {
  await get_screenshot();
  let { prob, coord } = await spawn_python("find_template", button, scale, webview_region, roi_region);

  
}

async function get_button_coords({ scale, webview_region, roi_region }) {
  let logger = logging.get_logger('button_coords', 'info')
  await get_screenshot("screen.png");
  
  let button_names = ['building/sell', 'building/move']
  let button_coords = {}
  for (let button of button_names) {
    let { prob, coord } = await spawn_python("find_template", button, scale, webview_region, roi_region);
    if (prob > 0.8) {
      button_coords[button] = coord;
    }
  }

  return button_coords
}

async function start() {
  this.button_coords = initialize();


  async function sell() {
    mouse_press(this.button_coords.sell_button)
  }
  async function move() {
    mouse_press(this.button_coords.move_button)
  }
}