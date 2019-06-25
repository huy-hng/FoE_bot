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

  // console.log(`Spawning Python function: ${script}, with args: ${JSON.stringify(args)}`);
  const scriptExecution = await spawn("C:\\Python\\Python37\\python.exe", [
    path.join(__dirname, `../../python/main.py`),
    script,
    JSON.stringify(args)
  ]);

  let python_return = "";
  let finished_python = false;

  scriptExecution.stdout.on("data", data => {
    let output = uint8arrayToString(data);
    let lines = output.split('\n')

    for (let line of lines) {
      if (line.substring(0, 7) === 'debug: ') { console.log(line) }
      else if (line.length == 0) {}
      else { python_return = line }
    }
    // console.log(python_return);
  });

  // handle error
  scriptExecution.stderr.on("data", data => {
    console.log(uint8arrayToString(data));
    throw 'Python error';
  });

  //#region wait for finish
  scriptExecution.on("exit", code => {
    // console.log("Python Process quit with code : " + code);
    finished_python = true;
  });
  while (!finished_python) {
    await sleep(10);
  }
  //#endregion

  try {
    return JSON.parse(python_return);
  } catch {
    console.log('Unable to parse JSON from python.')
  }
}

module.exports = spawn_python;
