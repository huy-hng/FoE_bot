// const Mousetrap = require('mousetrap');

const spawn_python = require("./functions/spawn_python");
const mouse_press = require("./functions/mouse_press");
const get_screenshot = require("./functions/screenshot");
const sleep = require("./functions/sleep");
const initializer = require("./initialize")

async function initialize() {
  let webview_data = await initializer();
  // console.log(webview_data);
  if (webview_data.message) {
    console.log(webview_data.message);
    return false;
  }
  return webview_data
}


async function start() {

  const webview_data = await initialize();

  const checkboxes = ['friends help', 'friends tavern', 
                      'guild help', 'neighbors help']

  if (webview_data) {
    show_buttons(true)

    for (const str of checkboxes) {
      if (document.getElementById(str).checked) {
        let tab = str.split(' ')[0];
        let action = str.split(' ')[1];

        console.log(action, tab);
        
        await click_all_images(tab, action, webview_data);
  
        await should_pause();
        if (stop) {
          toggle_stop()
          break
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
  
  if (webview_data) {
    await click_img(tab, webview_data)
    await click_img('first', webview_data);
    await sleep(2000);
    let last_page_prob = 0;
    while (last_page_prob < 0.9) {
      let loop_count = await click_images_in_page(str_template, webview_data);

      if (loop_count < 2) {
        last_page_prob = await check_last_page(webview_data);
      } else {
        await click_img("next", webview_data);
      }
      

      await should_pause();
      if (stop) {
        break
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
    // help_prob = await timer(click_img, str_template, webview_data);

    await should_pause();
    if (stop) {
      break
    }

    loop_count++;
  }
  console.log('Page finished.');
  return loop_count;
}

async function click_img(str_template, { scale, webview_region, roi_region }) {
  await get_screenshot("screen.png");
  let { prob, coord } = await spawn_python("find_template", str_template, scale, webview_region, roi_region);
  // console.log(str_template, prob, coord)
  if (prob > 0.8) {
    await mouse_press(coord);
  }
  return prob;
  
}

async function check_last_page(webview_data) {

  await click_img("next", webview_data);
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
  console.log(stop)
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