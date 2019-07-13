const path = require("path");
const sleep = require("./sleep");

let uint8arrayToString = data => {
  return String.fromCharCode.apply(null, data);
};

async function spawn_python(script, ...args) {
  const spawn = require("child_process").spawn;

  let scriptExecution;
  if (process.env.NODE_ENV == 'production') {
    scriptExecution = spawn(path.join(__dirname, "/../../python/dist/main/main.exe"), 
      [script, JSON.stringify(args)]);
  } else {
    scriptExecution = await spawn("C:\\Python\\Python37\\python.exe", [
      path.join(__dirname, `../../python/main.py`),
      script,
      JSON.stringify(args)
    ]);
  }
  // console.log(`Spawning Python function: ${script}, with args: ${JSON.stringify(args)}`);

  let python_return = "";
  let finished_python = false;

  scriptExecution.stdout.on("data", data => {
    let output = uint8arrayToString(data);
    let lines = output.split('\n')

    let logging_level = 30
    for (let line of lines) {
      if (line.substring(0, 7) === 'DEBUG: ' && logging_level <= 10) console.log('Python: ', line)
      else if (line.substring(0, 6) === 'INFO: ' && logging_level <= 20) console.log('Python: ', line)
      else if (line.substring(0, 6) === 'WARN: ' && logging_level <= 30) console.log('Python: ', line)
      else if (line.substring(0, 7) === 'ERROR: ' && logging_level <= 40) console.log('Python: ', line)
      else if (line.length == 0) {}
      else python_return = line
    }
    // console.log(python_return);
  });

  // handle error
  scriptExecution.stderr.on("data", data => {
    console.log(uint8arrayToString(data));
    throw 'Python Error';
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
    console.log(python_return)
    throw 'Unable to parse JSON from python.'
  }
}

module.exports = spawn_python;
