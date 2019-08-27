import { get_screenshot } from '../functions/screenshot';
import Logging from '../functions/logging';
import * as python from '../functions/python_endpoints';


const logging = new Logging('Base Initialize');

interface ReturnValue {
  scale: number;
  webview_region: number[];
}

export default class Initialize {

  async start(template: string) {
    let logger = logging.get_logger('start', 'INFO', true)
    logger.debug()

    let webview_region = await this.get_webview_region();
    let scale = await this.get_scale(webview_region, template)
    logger.debug('scale', scale)

    return { scale, webview_region }
  }
  
  protected async get_webview_region() {
    let logger = logging.get_logger('get_webview_region', 'INFO', true)
    logger.debug();

    document.getElementById('webview').style.borderColor = "rgba(0, 255, 0, 1)"
    await get_screenshot("screen.png");
    document.getElementById('webview').style.borderColor = "rgb(0, 255, 0, 0)"
    let webview_region: number[] = await python.get_webview_region();

    logger.debug('webview_region', JSON.stringify(webview_region))
    return webview_region
  }

  protected async get_scale(webview_region: number[], template: string) {
    let scale: number = await python.get_scale(webview_region, template);
    return scale
  }
}
