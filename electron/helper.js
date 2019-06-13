const get_coord = require("./functions/get_coord");
const mouse_press = require("./functions/mouse_press");
const sleep = require("./functions/sleep");

async function help_one() {
  console.log("start help_one");
  data = await get_coord("help");
  let prob = data.prob;
  let coord = data.coord;

  console.log("prob", prob);
  console.log("coord", coord);

  if (prob > 0.8){
    mouse_press(coord)
  }
}
