const get_coord = require("./functions/get_coord");
// const mouse_press = require("./functions/mouse_press");
const sleep = require("./functions/sleep");

async function help_one() {
  console.log("start help_one");
  data = await get_coord("help");
  let prob = data.prob;
  let loc = data.loc;

  console.log("help_one done", data);
  console.log("prob", prob);
  console.log("loc", loc);
}
