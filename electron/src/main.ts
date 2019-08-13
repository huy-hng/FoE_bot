import Logging from './functions/logging';
import Data from './functions/process_data';
import { auto_login } from './functions/auto_login';
import { initialize_gui } from './initializers/gui'
import { start as event_listener_start } from './event_listener'

const logging = new Logging('Main');


async function start() {

  await initialize_gui();
  event_listener_start();
  let data = await auto_login();
}

start()