const spawn_python = require("./functions/spawn_python");
const mouse_press = require("./functions/mouse_press");
const get_screenshot = require("./functions/screenshot");
const sleep = require("./functions/sleep");
const Initializer = require("./initialize")

async function help_all() {
  const initializer = await new Initializer();
  await sleep(10000)
  const scale = initializer.scale;
  const message = initializer.message;
  const webview_region = initializer.webview_region;
  const roi_region = initializer.roi_region;
  console.log('scale', scale);
  console.log('message', message);
  console.log('webview_region', webview_region);
  console.log('roi_region', roi_region);
  if (message) {
    return;
  }
  // await help_page(scale);
  // await click_img("next");
  // await help_page(scale);
}

async function help_page(scale) {
  let help_prob = 1;
  while (help_prob > 0.8) {
    help_prob = await click_img("help", scale);
    console.log(help_prob);
  }
}

async function click_img(str_template, scale) {
  await get_screenshot("screen.png");
  let { prob, coord } = await spawn_python("find_template", str_template, scale);
  if (prob > 0.8) {
    await mouse_press(coord);
  }
  return prob;
}

async function check_last_page() {
  await get_screenshot("last_screen.png");
  await click_img("next");
  await sleep(500);
  await get_screenshot("screen.png");
  let { prob, coord } = await spawn_python("check_last_page", img_name);
}
