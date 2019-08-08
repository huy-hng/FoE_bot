import Initializer from './initializers/initialize_auto_login';
import Logging from './functions/logging'
import * as helper from "./modules/helper"
import * as helpers from './functions/helpers';

const logging = new Logging('Main');


document.getElementById("start_button").addEventListener("click", helper.start);
document.getElementById("pause_button").addEventListener("click", helper.toggle_pause);
document.getElementById("stop_button").addEventListener("click", helper.toggle_stop);


onload = function () {
  let webview = document.getElementById("webview");
  let indicator = document.querySelector(".indicator");

  let loadstart = function () {
    indicator.innerText = "loading...";
    console.log('loading...')
  }
  let loadstop = function () {
    console.log('done')
    indicator.innerText = "done";
  }
  webview.addEventListener("loadstart", loadstart);
  webview.addEventListener("loadstop", loadstop);
}

// while(true) {
//   helpers.sleep(100);

// }

async function auto_login() {
  let logger = logging.get_logger('auto_login', 'DEBUG', true)
  await helpers.sleep(5000)
  let server = document.getElementById('server').value;
  logger.debug('server:', server);
  const initialize = new Initializer(server);
  let data = await initialize.start()
  logger.debug('data:', data);
  if (data.success) {
    logger.info('Successfully logged in');
  } else {
    logger.info('Failed auto login')
  }
}

auto_login()