const fs = require('fs')

class Logging {
  constructor(module_name) {
    this.loggers = {}
    this.module_name = module_name
  }


  get_logger(name, level = 'debug', log_to_console = false, log_to_file = true) {
    if (!this.loggers.hasOwnProperty(name)) {
      let logger_info = {
        module_name: this.module_name,
        name,
        level,
        log_to_console,
        log_to_file
      }
      let logger = new Logger(logger_info)
      this.loggers.name = logger
    }
    return this.loggers.name
  }
}


class Logger {
  constructor(logger_info) {
    this.module_name = logger_info.module_name;
    this.name = logger_info.name;
    let level = logger_info.level;

    this.console = logger_info.log_to_console
    this.file = logger_info.log_to_file

    this.levels = {
      notset: 0,
      debug: 10,
      info: 20,
      warning: 30,
      error: 40,
      critical: 50
    }


    if (typeof level == 'number') this.level = level;
    else this.level = this.levels[level];

  }
  get_message(level, ...args) {
    let padded_level = level.padEnd(6, ' ')
    let time = this.get_time()
    let message = args.join(' ')
    let console_log = padded_level + time + `${this.module_name}:${this.name}: ` + message
    let file_log = padded_level + time + `${this.name}: ` + message
    
    return { console_log, file_log }
  }
  log(level, ...args) {
    
    let { console_log, file_log } = this.get_message(level, args);
    
    if (this.console) console.log(console_log);
    if (this.file) this.write_to_file(file_log)
  }

  write_to_file(message) {
    fs.appendFile(`./logs/${this.module_name}.log`, message + '\n', err => {
      if (err) throw console.log(err);
    })
  }

  get_time() {
    let now = new Date();
    let time = now.getHours().toString().padStart(2, '0') + ':' +
      now.getMinutes().toString().padStart(2, '0') + ':' +
      now.getSeconds().toString().padStart(2, '0') + ':' +
      now.getMilliseconds().toString().padEnd(3, '0')
    return time.padEnd(14, ' ')
  }

  debug(...args) { if (this.level <= this.levels.debug) this.log('DEBUG', args) }
  info(...args) { if (this.level <= this.levels.info) this.log('INFO', args) }
  warning(...args) { if (this.level <= this.levels.warning) this.log('WARN', args) }
  error(...args) { if (this.level <= this.levels.error) this.log('ERROR', args) }
  // critical(...args) { if (this.level <= this.levels.critical) this.log('critical', args) }
}

module.exports = Logging;


function test_logging() {
  logging = new Logging('my_module');
  logger = logging.get_logger('my_logger', 'debug', log_to_console = true, log_to_file = true)

  logger.debug('debug message', 'second message', 'third message')
  logger.info('info message')
  logger.warning('warning message')
  logger.error('error message')

  logger = logging.get_logger('my_logger 2', 'debug', log_to_console = true, log_to_file = true)

  logger.debug('debug message', 'second message', 'third message')
  // logger.critical('criticcal message')
}