import Base_initializer from './base';
import Logging from '../functions/logging';
import { get_screenshot } from '../functions/screenshot';
import * as python from '../functions/python_endpoints';
import * as helpers from '../functions/helpers';


const logging = new Logging('InitializeHelper');

interface ReturnValue {
  scale: number;
  webview_region: number[];
  roi_region: number[]
}

export default class InitializeHelper extends Base_initializer {
  async start(): Promise<ReturnValue> {
    const logger = logging.get_logger('start', 'INFO', true)

    let { scale, webview_region } = await super.start('in_game')

    let roi_region: number[];
    if (scale) {
      roi_region = await this.get_roi_region(scale, webview_region)
      logger.info('Finished Initialization')
    } else {
      throw logger.error('No scale value');
    }
    return { scale, webview_region, roi_region}
  }

  protected async get_roi_region(scale: number, webview_region: number[]) {
    const logger = logging.get_logger('get_roi_region', 'DEBUG', true)
    logger.debug(`args: ts.scale = ${scale}, webview_region = ${webview_region}`);

    let roi_on_screen = await python.check_roi_on_screen(scale, webview_region);
    if (roi_on_screen == 0.5) {
      // press up arrow
      helpers.click_img('navigation/up', {scale, webview_region})

      await helpers.sleep(2000);

    } else if (roi_on_screen == 0) throw logger.error("Couldn't get roi_region")
      
    await get_screenshot("screen.png");
    let roi_region = await python.get_roi_region(scale, webview_region)

    logger.debug(roi_region)
    return roi_region
  }
}