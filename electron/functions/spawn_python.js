const path = require("path");
const sleep = require("./sleep");

let uint8arrayToString = data => {
  return String.fromCharCode.apply(null, data);
};

async function spawn_python(script, ...args) {
  const spawn = require("child_process").spawn;
  // const scriptExecution = spawn(
  //   path.join(__dirname, "/../python/dist/main/main.exe"),
  //   ["args"]
  // );

  console.log(
    `Spawning Python function: ${script}, with args: ${JSON.stringify(args)}`
  );
  const scriptExecution = await spawn("C:\\Python\\Python37\\python.exe", [
    path.join(__dirname, `../../python/main.py`),
    script,
    JSON.stringify(args)
  ]);

  let python_return = "";
  let finished_python = false;

  scriptExecution.stdout.on("data", data => {
    python_return += uint8arrayToString(data);
  });
  scriptExecution.stderr.on("data", data => {
    python_return += uint8arrayToString(data);
  });
  scriptExecution.on("exit", code => {
    // console.log("Python Process quit with code : " + code);
    finished_python = true;
  });

  while (!finished_python) {
    await sleep(10);
  }
  console.log(python_return);
  try {
    return JSON.parse(python_return);
  } catch {
    console.log('Unable to parse JSON from python.')
  }
}

module.exports = spawn_python;
