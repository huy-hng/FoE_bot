const spawn_python = require("./functions/spawn_python");
const mouse_press = require("./functions/mouse_press");
const get_screenshot = require("./functions/screenshot");
const sleep = require("./functions/sleep");
const initialize = require("./initialize")

async function help_all() {

  let { scale, webview_region, roi_region, message } = await initialize();
  if (message) {
    console.log(message);
    return;
  }

  if (roi_region) {
    let last_page_prob = 0; 
    while (last_page_prob < 0.9){
      await help_page(scale, webview_region);
      last_page_prob = await check_last_page(scale, webview_region, roi_region);
    }
    console.log('Done');
    
  }
}


async function help_page(scale, webview_region) {
  let help_prob = 1;
  while (help_prob > 0.8) {
    help_prob = await click_img("help", scale, webview_region);
  }
  console.log('Page finished.');
}

async function click_img(str_template, scale, webview_region) {
  await get_screenshot("screen.png");
  let { prob, coord } = await spawn_python("find_template", str_template, scale, webview_region);
  console.log(str_template, prob, coord)
  if (prob > 0.8) {
    await mouse_press(coord);
  }
  return prob;
}

async function check_last_page(scale, webview_region, roi_region) {
  await get_screenshot("last_screen.png");
  await click_img("next", scale, webview_region);
  await sleep(500);
  await get_screenshot("screen.png");
  let prob = await spawn_python("check_last_page", webview_region, roi_region);
  return prob
}
