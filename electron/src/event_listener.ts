import Data from "./functions/process_data";
import Logging from './functions/logging';
import * as helper from './modules/helper';

const logging = new Logging('event_listener')
const app_data = new Data('app')

export function start() {
  // buttons
  document.getElementById("start_button").addEventListener("click", helper.start);
  document.getElementById("pause_button").addEventListener("click", helper.toggle_pause);
  document.getElementById("stop_button").addEventListener("click", helper.toggle_stop);


  //#region todo checkboxes
  const friends_help = document.getElementById('friends help')
  const friends_tavern = document.getElementById('friends tavern')
  const guild_help = document.getElementById('guild help')
  const neighbors_help = document.getElementById('neighbors help')

  //@ts-ignore
  friends_help.addEventListener('change', () => { save_data('friends help', friends_help.checked)});
  //@ts-ignore
  friends_tavern.addEventListener('change', () => { save_data('friends tavern', friends_tavern.checked)});
  //@ts-ignore
  guild_help.addEventListener('change', () => { save_data('guild help', guild_help.checked)});
  //@ts-ignore
  neighbors_help.addEventListener('change', () => { save_data('neighbors help', neighbors_help.checked)});
  //#endregion
  
  //#region auto_login
  const auto_login = document.getElementById('auto_login')
  const server = document.getElementById('server')
  
  //@ts-ignore
  auto_login.addEventListener('change', () => { save_data('auto_login', auto_login.checked) });
  //@ts-ignore
  server.addEventListener('change', () => { save_data('auto_login_server', server.value) });
  //#endregion
}

function save_data(key: string, value: any) {
  const logger = logging.get_logger('save_data', 'INFO', true);
  logger.debug(key, value);
  app_data.set_new_data({ [key]: value })
}