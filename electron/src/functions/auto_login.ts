import Initializer from '../initializers/initialize_auto_login';
import * as helpers from './helpers';
import Logging from './logging';

const logging = new Logging('auto_login')

export async function auto_login() {
  const logger = logging.get_logger('', 'INFO', true)
  //@ts-ignore
  let auto_login: boolean = document.getElementById('auto_login').checked;
  logger.debug('auto_login:', auto_login);

  if (!auto_login) {
    logger.info('Skipping auto login');
    return
  }
  await helpers.sleep(2000)
  //@ts-ignore
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
