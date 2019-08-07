const fs = require('fs');
class Logging {
    constructor(module_name) {
        this.loggers = {};
        this.module_name = module_name;
    }
    get_logger(name, level = 'DEBUG', log_to_console = false) {
        if (!this.loggers.hasOwnProperty(name)) {
            let logger_info = {
                module_name: this.module_name,
                name,
                level,
                log_to_console,
            };
            let logger = new Logger(logger_info);
            this.loggers.name = logger;
        }
        return this.loggers.name;
    }
}
class Logger {
    constructor(logger_info) {
        this.module_name = logger_info.module_name;
        this.name = logger_info.name;
        let level = logger_info.level;
        this.console = logger_info.log_to_console;
        this.levels = {
            NOTSET: 0,
            DEBUG: 10,
            INFO: 20,
            WARN: 30,
            ERROR: 40,
            CRITICAL: 50
        };
        if (typeof level == 'number')
            this.level = level;
        else
            this.level = this.levels[level];
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
        let console_log = padded_level + time + `${this.module_name}: ${this.name}: ` + message;
        let file_log = padded_level + time + `${this.name}: ` + message;
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
module.exports = Logging;
function test_logging() {
    logging = new Logging('my_module');
    logger = logging.get_logger('my_logger', 'DEBUG', log_to_console = true);
    logger.debug('debug message', { asd: 'asd', erg: 'wef' }, [123, 651, 156, 1]);
    logger.info('info message');
    logger.warn('warning message');
    logger.error('error message');
    logger = logging.get_logger('my_logger 2', 'DEBUG', log_to_console = true);
    logger.debug('debug message', 'second message', 'third message');
}
// test_logging()
