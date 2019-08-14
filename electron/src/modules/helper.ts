import Initializer from '../initializers/initialize_helper'
import { get_screenshot } from "../functions/screenshot"
import Logging from "../functions/logging"

import * as python from "../functions/python_endpoints"
import * as helpers from '../functions/helpers';
import { WebviewData } from '../interfaces';

const logging = new Logging('helper')

export async function start() {
  let logger = logging.get_logger('start', 'info', true)

  const initialize = new Initializer();
  const webview_data = await initialize.start();
  logger.debug('webview_data', webview_data)
  
  if (!webview_data.success) return

  const checkboxes = ['friends help', 'friends tavern', 
                      'guild help', 'neighbors help']

  show_buttons(true)

  for (const str of checkboxes) {
    //@ts-ignore
    if (document.getElementById(str).checked) {
      let tab = str.split(' ')[0];
      let action = str.split(' ')[1];

      logger.info(action, tab)
      
      await click_all_images(tab, action, webview_data);

      await should_pause();
      if (stop) {
        toggle_stop()
        console.log('Stopped')
        break
      }
    }
  }
  
  console.log('Finished everything')
  show_buttons(false)
}

function show_buttons(show: boolean) {

  let start: string;
  let rest: string;
  if (show) {
    start = 'none';
    rest = 'flex';
  } else {
    start = 'flex';
    rest = 'none';
  }
  document.getElementById('start_button').style.display = start;
  document.getElementById('pause_button').style.display = rest;
  document.getElementById('stop_button').style.display = rest;
}

async function click_all_images(tab: string, template: string, webview_data: WebviewData) {
  let logger = logging.get_logger('click_all_images', 'info', true)
  logger.debug();

  
  await helpers.click_img(`helping/${tab}`, webview_data)
  await helpers.click_img('navigation/first', webview_data);
  await helpers.sleep(2000);
  let last_page_prob = 0;
  while (last_page_prob < 0.9) {
    let loop_count = await click_images_in_page(`helping/${template}`, webview_data);
    logger.debug('loop_count', loop_count)

    if (loop_count < 2) {
      last_page_prob = await check_last_page(webview_data);
    } else {
      await helpers.click_img("navigation/next", webview_data);
    }
    

    await should_pause();
    if (stop) {
      return
    }
  }
  console.log(`Finished ${tab} ${template
  }`);
}

async function click_images_in_page(template: string, webview_data: WebviewData) {

  let help_prob = true;
  let loop_count = 0;
  while (help_prob) {

    help_prob = await helpers.click_img(template, webview_data);

    await should_pause();
    if (stop) {
      return
    }

    loop_count++;
  }
  console.log('Page finished.');
  return loop_count;
}


async function check_last_page(webview_data: WebviewData) {

  await helpers.click_img("navigation/next", webview_data);
  await get_screenshot("next_screen.png");
  // let prob = await spawn_python("check_last_page", webview_data.webview_region, webview_data.roi_region);
  let prob = await python.check_last_page(webview_data)

  return prob
}


//#region helper
async function timer(fn, ...args) {
  let t0 = performance.now();
  let output = await fn(args);
  let t1 = performance.now();
  // console.log(`${fn.name} took ${t1 - t0} seconds.`);
  console.log(`${fn.name} took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);
  return output
}
//endregion
//#region pause / stop
let paused = false;
let stop = false;

export function toggle_pause() {
  paused = !paused;
}

export function toggle_stop() {
  stop = !stop;
  if (stop) console.log('Stopping')
}

async function should_pause() {
  if (paused) {
    document.getElementById('pause_button').innerHTML = 'Unpause';
    console.log('Paused.');
    while (paused) {
      await helpers.sleep(500);
      if (stop) {
        break
      }
    }
    document.getElementById('pause_button').innerHTML = 'Pause';
    console.log('Unpaused.');
  }
}
//#endregion