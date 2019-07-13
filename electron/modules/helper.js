const spawn_python = require("./functions/spawn_python");
const mouse_press = require("./functions/mouse_press");
const get_screenshot = require("./functions/screenshot");
const sleep = require("./functions/sleep");
const Logging = require("./functions/logging");
const initializer = require("./functions/initialize")

const logging = new Logging('helper')

async function initialize() {
  let logger = logging.get_logger('initialize', 'info', true, true)
  let webview_data = await initializer();
  logger.debug('webview_data', webview_data)
  if (webview_data.message) {
    console.log(webview_data.message);
    return false;
  }
  return webview_data
}


async function start() {
  let logger = logging.get_logger('start', 'info', true, true)

  const webview_data = await initialize();

  const checkboxes = ['friends help', 'friends tavern', 
                      'guild help', 'neighbors help']

  if (webview_data) {
    show_buttons(true)

    for (const str of checkboxes) {
      if (document.getElementById(str).checked) {
        let tab = str.split(' ')[0];
        let action = str.split(' ')[1];

        logger.info(action, tab)
        
        await click_all_images(tab, action, webview_data);
  
        await should_pause();
        if (stop) {
          toggle_stop()
          console.log('Stopped')
          show_buttons(false)
          return
        }
      }
    }
  }
  console.log('Finished everything')
  show_buttons(false)
}

function show_buttons(show) {

  let start;
  let rest;
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

async function click_all_images(tab, str_template, webview_data) {
  let logger = logging.get_logger('click_all_images', 'info', true, true)
  
  if (webview_data) {
    await click_img(`helping/${tab}`, webview_data)
    await click_img('navigation/first', webview_data);
    await sleep(2000);
    let last_page_prob = 0;
    while (last_page_prob < 0.9) {
      let loop_count = await click_images_in_page(`helping/${str_template}`, webview_data);
      logger.debug('loop_count', loop_count)

      if (loop_count < 2) {
        last_page_prob = await check_last_page(webview_data);
      } else {
        await click_img("navigation/next", webview_data);
      }
      

      await should_pause();
      if (stop) {
        return
      }
    }
    console.log('Finished task');
  }
}

async function click_images_in_page(str_template, webview_data) {

  let help_prob = 1;
  let loop_count = 0;
  while (help_prob > 0.8) {

    help_prob = await click_img(str_template, webview_data);

    await should_pause();
    if (stop) {
      return
    }

    loop_count++;
  }
  console.log('Page finished.');
  return loop_count;
}

async function click_img(str_template, { scale, webview_region, roi_region }) {
  let logger = logging.get_logger('click_img', 'debug')
  await get_screenshot("screen.png");
  let { prob, coord } = await spawn_python("find_template", str_template, scale, webview_region, roi_region);
  logger.debug(str_template, prob, coord)
  if (prob > 0.8) await mouse_press(coord)
  return prob;
}

async function check_last_page(webview_data) {

  await click_img("navigation/next", webview_data);
  await get_screenshot("next_screen.png");
  let prob = await spawn_python("check_last_page", webview_data.webview_region, webview_data.roi_region);

  return prob
}


//#region helper
async function timer(fn, ...args) {
  let t0 = performance.now();
  output = await fn(args);
  let t1 = performance.now();
  // console.log(`${fn.name} took ${t1 - t0} seconds.`);
  console.log(`${fn.name} took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);
  return output
}
//endregion
//#region pause / stop
let paused = false;
let stop = false;

function toggle_pause() {
  paused = !paused;
}

function toggle_stop() {
  stop = !stop;
  if (stop) console.log('Stopping')
}

async function should_pause() {
  if (paused) {
    document.getElementById('pause_button').innerHTML = 'Unpause';
    console.log('Paused.');
    while (paused) {
      await sleep(500);
      if (stop) {
        break
      }
    }
    document.getElementById('pause_button').innerHTML = 'Pause';
    console.log('Unpaused.');
  }
}
//#endregion