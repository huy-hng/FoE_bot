import Logging from "./logging";
import { get_screenshot } from './screenshot';
import * as python from './python_endpoints';

const logging_helpers = new Logging('helpers');

export async function click_img(template: string, webview_data) {

  /* scale: number, webview_region: number[], roi_region?: number[] */
  let { scale, webview_region, roi_region } = webview_data;
  let logger = logging_helpers.get_logger('click_img', 'DEBUG')

  await get_screenshot("screen.png");
  let { prob, coord } = await python.find_template(template, scale, webview_region, roi_region)
  logger.debug(template, prob, coord)
  
  if (prob > 0.8) await mouse_press(coord)
  return prob;
}

async function mouse_press(coord: number[]) {
  let webview = document.getElementById("webview");

  let x = coord[0] * webview.clientWidth;
  let y = coord[1] * webview.clientHeight;

  webview.sendInputEvent({
    type: "mouseDown",
    x: x,
    y: y,
    button: "left",
    clickCount: 1
  });
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