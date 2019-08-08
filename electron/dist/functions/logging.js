"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Logging {
    constructor(module_name) {
        this.module_name = module_name;
        this.loggers = {};
    }
    get_logger(logger_name, logging_level = 'DEBUG', log_to_console = false) {
        if (!this.loggers.hasOwnProperty(logger_name)) {
            let logger = new Logger(this.module_name, logger_name, logging_level, log_to_console);
            this.loggers[logger_name] = logger;
        }
        return this.loggers[logger_name];
    }
}
exports.default = Logging;
class Logger {
    constructor(module_name, logger_name, logging_level, console) {
        this.module_name = module_name;
        this.logger_name = logger_name;
        this.logging_level = logging_level;
        this.console = console;
        this.levels = {
            NOTSET: 0,
            DEBUG: 10,
            INFO: 20,
            WARN: 30,
            ERROR: 40,
            CRITICAL: 50
        };
        if (typeof logging_level == 'number')
            this.level = logging_level;
        else
            this.level = this.levels[logging_level];
    }
    debug(...args) { this.log('DEBUG', args); }
    info(...args) { this.log('INFO', args); }
    warn(...args) { this.log('WARN', args); }
    error(...args) { this.log('ERROR', args); }
    log(level, args) {
        let { console_log, file_log } = this.get_message(level, args);
        this.log_to_console(level, console_log);
        this.log_to_file(this.module_name, file_log);
    }
    get_message(level, args) {
        let padded_level = level.padEnd(6, ' ');
        let time = this.get_time();
        let message = '';
        for (let arg of args) {
            if (typeof arg == 'object') {
                try {
                    message += JSON.stringify(arg) + ' ';
                }
                catch (_a) {
                    message += arg + " ";
                }
            }
            else {
                message += arg + ' ';
            }
        }
        let console_log = padded_level + time + `${this.module_name}: ${this.logger_name}: ` + message;
        let file_log = padded_level + time + `${this.logger_name}: ` + message;
        return { console_log, file_log };
    }
    log_to_console(level, message) {
        if (this.level <= this.levels[level]) {
            if (this.console)
                console.log(message);
            this.log_to_file('console', message);
        }
        this.log_to_file('console_all', message);
    }
    log_to_file(file_name, message) {
        fs.appendFile(`./logs/${file_name}.log`, message + '\n', err => {
            if (err)
                throw console.log(err);
        });
    }
    get_time() {
        let now = new Date();
        let time = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0') + ':' +
            now.getSeconds().toString().padStart(2, '0') + ':' +
            now.getMilliseconds().toString().padStart(3, '0');
        return time.padEnd(14, ' ');
    }
}
function test_logging() {
    let logging = new Logging('my_module');
    let logger = logging.get_logger('my_logger', 'DEBUG', true);
    logger.debug('debug message', { asd: 'asd', erg: 'wef' }, [123, 651, 156, 1]);
    logger.info('info message');
    logger.warn('warning message');
    logger.error('error message');
    logger = logging.get_logger('my_logger 2', 'DEBUG', true);
    logger.debug('debug message', 'second message', 'third message');
}
// test_logging()
