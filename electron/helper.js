const get_coord = require("./functions/get_coord");
const mouse_press = require("./functions/mouse_press");
const get_screenshot = require("./functions/screenshot");
const sleep = require("./functions/sleep");

async function click_img(img_name) {
  await get_screenshot();
  let {prob, coord} = await get_coord(img_name);

  // console.log("prob", prob);
  // console.log("coord", coord);

  if (prob > 0.8){
    await mouse_press(coord)
  }
  return prob
}

async function help_page() {
  let help_prob = 1;
  while (help_prob > 0.8) {
    help_prob = await click_img('help')
    console.log(help_prob);
  } 
}
async function help_all() {
  await help_page()
  await click_img('next')
  await help_page()
  
}