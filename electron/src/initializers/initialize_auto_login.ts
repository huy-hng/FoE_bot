import Base_initializer from './base';
import Logging from '../functions/logging';
import * as helpers from '../functions/helpers';


const logging = new Logging('InitializeAutoLogin');

interface ReturnValue {
  success: boolean;
  scale: number;
  webview_region: number[];
  message: string;
}

export default class InitializeAutoLogin extends Base_initializer {
  constructor(private server: string) { super() }
  
  async start(): Promise<ReturnValue> {
    let logger = logging.get_logger('start', 'INFO', true) 

    let { scale, webview_region } = await super.start('spielen_text')
    
    let success = false;
    let message: string;

    if (scale) {
      let play = await helpers.click_img('spielen_text', {scale, webview_region})
      let server = await helpers.click_img(`servers/${this.server}`, {scale, webview_region})

      logger.debug('play:', play);
      logger.debug('server:', server);

      if (play && server) {
        success = true;
      } else if (!play) {
        message = "Couldn't find play button";
      } else if (play && !server) {
        message = "Couldn't find server";
      }
    }

    message = 'Finished Initialization';
    return { success, scale, webview_region, message}
  }
}