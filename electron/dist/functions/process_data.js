"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const logging_1 = require("./logging");
const logging = new logging_1.default('Data');
class Data {
    constructor(file_name) {
        this.file_name = file_name;
        this.file_location = `./data/${file_name}.json`;
    }
    get data() {
        return this.get_data();
    }
    set data(data) {
        this.set_data(data);
    }
    async get_data() {
        const logger = logging.get_logger('read_data', 'INFO', true);
        let data;
        if (fs.existsSync(this.file_location)) {
            data = fs.readFileSync(this.file_location, 'utf8');
        }
        else {
            data = this.create_file();
        }
        logger.debug('data:', data);
        return JSON.parse(data);
    }
    create_file() {
        let json_obj;
        if (this.file_name == 'app')
            json_obj = default_app_settings;
        if (this.file_name == 'helper')
            json_obj = helper_empty_params;
        this.set_data(json_obj);
        return JSON.stringify(json_obj);
    }
    async set_data(data) {
        const logger = logging.get_logger('set_data', 'INFO', true);
        fs.writeFile(this.file_location, JSON.stringify(data, null, 2), err => {
            if (err)
                throw err;
            logger.debug('File successfully saved');
        });
    }
    async set_new_data(new_data) {
        const logger = logging.get_logger('set_data', 'INFO', true);
        let data = await this.get_data();
        for (let key in new_data) {
            data[key] = new_data[key];
        }
        await this.set_data(data);
        logger.debug('Successfully saved new data');
    }
}
exports.default = Data;
const default_app_settings = {
    "auto_login": false,
    "auto_login_server": "",
    "friends help": true,
    "friends tavern": true,
    "guild help": true,
    "neighbors help": false
};
const helper_empty_params = {
    last_checked: Math.floor(Date.now() / 1000),
    potential_helpers: {},
    helpers: {}
};
