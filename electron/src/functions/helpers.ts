import Logging from "./logging";
import { get_screenshot } from './screenshot';
import { WebviewData } from '../interfaces';
import * as python from './python_endpoints';

const logging_helpers = new Logging('helpers');

export async function click_img(template: string, webview_data: WebviewData, prop_threshold=0.8) {

  let { scale, webview_region, roi_region } = webview_data;
  let logger = logging_helpers.get_logger('click_img', 'INFO')

  await get_screenshot("screen.png");
  let { prob, coord } = await python.find_template(template, scale, webview_region, roi_region)
  logger.debug(template, prob, coord)
  
  if (prob > prop_threshold) await mouse_press(coord)
  return prob > prop_threshold;
}

async function mouse_press(coord: number[]) {
  let webview = document.getElementById("webview");

  let x = coord[0] * webview.clientWidth;
  let y = coord[1] * webview.clientHeight;

  //@ts-ignore
  webview.sendInputEvent({
    type: "mouseDown",
    x: x,
    y: y,
    button: "left",
    clickCount: 1
  });
  //@ts-ignore
  webview.sendInputEvent({
    type: "mouseUp",
    x: x,
    y: y,
    button: "left",
    clickCount: 1
  });
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
