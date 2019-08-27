import fs = require('fs')
import * as python from "../functions/python_endpoints";
import Logging from '../functions/logging';
import Initializer from '../initializers/base';
import Data from '../functions/process_data';
import { WebviewData } from '../interfaces';

const logging = new Logging('watcher');
const helper_data = new Data('helper')

async function initialize() {
  const logger = logging.get_logger('initialize', 'DEBUG', true);
  const initialize = new Initializer();
  let webview_data = await initialize.start('./ereignis_uebersicht/top_right_ereignis_ubersicht')
  logger.debug('webview_data', webview_data);
  if (!webview_data.scale) return false

  return webview_data
}

export async function main() {
  const logger = logging.get_logger('main', 'DEBUG', true);

  let webview_data = await initialize()
  let data;
  if (webview_data) {
    data = await python.get_names(webview_data.scale, webview_data.webview_region)
  } else { logger.warn('Ereignis uebersicht not open');}

  logger.debug('data:', data);
  // let data = await helper_data.get_data() 
  // if (Object.keys(data.potential_helpers).length == 0) {
  //   // initialize potential helpers
  //   data = get_all_potential_helpers(data)
  //   helper_data.set_data(data)
  // }
  // data = get_all_helpers(data)
}

async function get_all_helpers(data: WebviewData) {
  let { scale, webview_region } = data;

  let helpers_loc = await python.find_all_template_locations('ereignis_uebersicht/golden_star', scale, webview_region);
  let helpers_names = await get_names(helpers_loc)

  for (let name of helpers_names) {
    if ((name in data.helpers)) {
      data.helpers.name.push()
    }
  }
  return data
}


async function get_names(helper_loc) {
  return {}
}

async function get_all_potential_helpers(data) {
  return data
}