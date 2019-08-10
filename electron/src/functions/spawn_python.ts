import * as path from "path"
import * as helpers from './helpers';
import Logging from './logging';

const logging = new Logging('spawn_python')
import { spawn } from "child_process"

let uint8arrayToString = data => {
  return String.fromCharCode.apply(null, data);
};

export async function spawn_python(script: string, ...args) {
  let logger = logging.get_logger('main', 'WARN', true)
  
  logger.info(`Spawning Python instance: ${script}, with args: ${JSON.stringify(args)}`);

  let scriptExecution;
  if (process.env.NODE_ENV == 'p') {
    scriptExecution = await spawn(path.join(__dirname, "/../../python/main.exe"), 
      [script, JSON.stringify(args)]);

  } else {
    logger.info('Running in development mode');
    
    // scriptExecution = await spawn("C:\\Users\\Huy\\.virtualenvs\\FoE_bot-UE06RW1m\\Scripts\\python.exe", [
    scriptExecution = await spawn("C:\\Users\\huy-h\\.virtualenvs\\FoE_bot-UE06RW1m\\Scripts\\python.exe", [
      path.join(__dirname, `../../../python/main.py`),
      script,
      JSON.stringify(args)
    ]);
  }


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
  });

  // handle error
  scriptExecution.stderr.on("data", data => {
    logger.error(uint8arrayToString(data));
    throw 'Python Error';
  });

  //#region wait for finish
  scriptExecution.on("exit", code => {
    finished_python = true;
    logger.info('Python Process quit with code:', code);
  });
  while (!finished_python) {
    await helpers.sleep(10);
  }
  //#endregion

  try {
    logger.debug('python_return:', python_return);
    return JSON.parse(python_return);
  } catch {
    logger.warn(python_return);
    throw 'Unable to parse JSON from python.'
  }
}
