import Data from '../functions/process_data';
import Logging from '../functions/logging'

const logging = new Logging('Initialize Gui')
export async function initialize_gui() {
  const logger = logging.get_logger('initialize_gui', 'INFO', true)

  const app_data = new Data('app');
  let data = await app_data.get_data();
  logger.debug(data);
  logger.debug(typeof data);

  //@ts-ignore
  document.getElementById('auto_login').checked = data.auto_login;
  //@ts-ignore
  document.getElementById('server').value = data.auto_login_server;

}