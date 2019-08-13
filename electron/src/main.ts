import Logging from './functions/logging';
import Data from './functions/process_data';
import { auto_login } from './functions/auto_login';
import { initialize_gui } from './initializers/gui'
import { start as event_listener_start } from './event_listener'

const logging = new Logging('Main');


async function on_load() {
  const logger = logging.get_logger('on_load', 'DEBUG', true);
  logger.debug('start on load');
  let webview = document.getElementById("webview");


  let loadstart = () => {
    console.log('loading...')
  }
  let loadstop = () => {
    console.log('done')
  }

  webview.addEventListener("loadstart", loadstart);
  webview.addEventListener("loadstop", loadstop);
}


async function start() {
  await on_load()
  await initialize_gui()
  event_listener_start()
  auto_login()
}

start()