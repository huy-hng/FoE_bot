const path = require("path");
const get_screenshot = require("./screenshot");
const sleep = require("./sleep");



let uint8arrayToString = function(data) {
  return String.fromCharCode.apply(null, data);
};

async function get_coord(template_str) {
  console.log("get screenshot start");
  await get_screenshot();
  console.log("get screenshot end");

  console.log("start python process");
  // await sleep(2000);

  const spawn = require("child_process").spawn;
  // const scriptExecution = spawn(
  //   path.join(__dirname, "/../python/dist/main/main.exe"),
  //   ["args"]
  // );


  const scriptExecution = await spawn("C:\\Python\\Python37\\python.exe", [
    path.join(__dirname, "../../python/main.py"),
    template_str
  ]);

  let python_return;
  let finished_python = false;

  scriptExecution.stdout.on("data", data => {
    python_return = uint8arrayToString(data);
  });
  scriptExecution.stderr.on("data", data => {
    python_return = uint8arrayToString(data);
  });
  scriptExecution.on("exit", code => {
    console.log("Python Process quit with code : " + code);
    finished_python = true
  });

  while (!finished_python) {
    await sleep(10)
  }
  return JSON.parse(python_return);
}

module.exports = get_coord;
