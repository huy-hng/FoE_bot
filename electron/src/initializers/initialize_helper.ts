import Base_initializer from './base';
import Logging from '../functions/logging';
import { get_screenshot } from '../functions/screenshot';
import * as python from '../functions/python_endpoints';
import * as helpers from '../functions/helpers';
import { WebviewData } from '../interfaces';


const logging = new Logging('InitializeHelper');


export default class InitializeHelper extends Base_initializer {
  async start(): Promise<WebviewData> {
    let logger = logging.get_logger('main', 'INFO', true)
    logger.debug()

    let webview_region = await this.get_webview_region();

    let scale = await this.get_scale(webview_region, 'in_game');
    logger.debug('scale', scale);

    let success = false;
    let roi_region: number[];
    if (scale) {
      success = true;
      roi_region = await this.get_roi_region(scale, webview_region)
      logger.info('Finished Initialization')
    }

    return { success, scale, webview_region, roi_region}
  }

  protected async get_roi_region(scale: number, webview_region: number[]) {
    let logger = logging.get_logger('get_roi_region', 'DEBUG', true)
    logger.debug(`args: ts.scale = ${scale}, webview_region = ${webview_region}`);

    let roi_on_screen = await python.check_roi_on_screen(scale, webview_region);
    if (roi_on_screen == 0.5) {
      // press up arrow
      helpers.click_img('navigation/up', {scale, webview_region})

      await helpers.sleep(2000);

    } else if (roi_on_screen == 0) throw new Error('Something is wrong')

    await get_screenshot("screen.png");
    let roi_region = await python.get_roi_region(scale, webview_region)

    logger.debug(roi_region)
    return roi_region
  }
}