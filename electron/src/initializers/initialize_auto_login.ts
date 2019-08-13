import * as interfaces from '../interfaces';
import Base_initializer from './base';
import Logging from '../functions/logging';
import * as python from '../functions/python_endpoints';
import * as helpers from '../functions/helpers';


const logging = new Logging('InitializeAutoLogin');


export default class InitializeAutoLogin extends Base_initializer {
  constructor(private server: string) { super() }
  
  async start(): Promise<interfaces.Initialize>  {
    let logger = logging.get_logger('main', 'INFO', true) 
    logger.debug()

    let webview_region = await this.get_webview_region();

    let scale = await this.get_scale(webview_region, 'spielen_text')
    logger.debug('scale', scale)
    let success = false;
    let message: string;

    if (scale) {
      let play = await helpers.click_img('spielen_text', {scale, webview_region})
      let server = await helpers.click_img(`servers/${this.server}`, {scale, webview_region})

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