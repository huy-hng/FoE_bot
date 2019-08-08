import Base_initializer from './base';
import Logging from '../functions/logging';
import * as python from '../functions/python_endpoints';
import * as helpers from '../functions/helpers';


const logging = new Logging('InitializeAutoLogin');


export default class InitializeAutoLogin extends Base_initializer {
  constructor(private server: string) { super() }
  
  async start() {
    let logger = logging.get_logger('main', 'INFO', true)
    logger.debug()

    let webview_region = await this.get_webview_region();

    let scale = await this.get_scale(webview_region, 'spielen_text')
    logger.debug('scale', scale)

    if (scale) {
      await helpers.click_img('spielen_text', {scale, webview_region})
      await helpers.click_img(`servers/${this.server}`, {scale, webview_region})

      logger.info('Finished Initialization')
      return { success: true, scale, webview_region }
    } else {
      logger.info('Finished Initialization')
      return { success: false, message: 'Auto login failed'}
    }
  }
}