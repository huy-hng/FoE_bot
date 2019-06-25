// const Mousetrap = require('mousetrap');

const spawn_python = require("./functions/spawn_python");
const mouse_press = require("./functions/mouse_press");
const get_screenshot = require("./functions/screenshot");
const sleep = require("./functions/sleep");
const initializer = require("./initialize")

async function initialize() {
  let webview_data = await initializer();
  if (webview_data.message) {
    console.log(webview_data.message);
    return false;
  }
  return webview_data
}

async function help_all() {
  let webview_data = await initialize();
  await click_all_images('friends_tab', 'help', webview_data)
  await click_all_images('guild_tab', 'help', webview_data)
  await click_all_images('neighbors_tab', 'help', webview_data)
}

async function visit_taverns() {
  let webview_data = await initialize();
  await click_all_images('friends_tab', 'tavern', webview_data)
}

async function do_all() {
  visit_taverns();
  help_all()
}


async function click_all_images(tab, str_template, webview_data) {
  
  if (webview_data) {
    await click_img(tab, webview_data)
    await click_img('first', webview_data);
    let last_page_prob = 0;
    while (last_page_prob < 0.9) {
      await click_images_in_page(str_template, webview_data);
      last_page_prob = await check_last_page(webview_data);

      await should_pause();
    }
    console.log('Done.');

  }
}

async function click_images_in_page(str_template, webview_data) {

  let help_prob = 1;
  while (help_prob > 0.8) {
    help_prob = await click_img(str_template, webview_data);

    await should_pause();
  }
  console.log('Page finished.');
}

async function click_img(str_template, { scale, webview_region }) {
  await get_screenshot("screen.png");
  let { prob, coord } = await spawn_python("find_template", str_template, scale, webview_region);
  console.log(str_template, prob, coord)
  if (prob > 0.8) {
    await mouse_press(coord);
  }
  return prob;
}

async function check_last_page(webview_data) {
  await get_screenshot("last_screen.png");
  await click_img("next", webview_data);
  await sleep(500);
  await get_screenshot("screen.png");
  let prob = await spawn_python("check_last_page", webview_data.webview_region, webview_data.roi_region);
  return prob
}

//#region pause
let paused = false;

function toggle_pause() {
  paused = !paused;
}

async function should_pause() {
  if (paused) {
    console.log('Paused.');
    while (paused) {
      await sleep(500);
    }
    console.log('Unpaused.');
  }
}
//#endregion