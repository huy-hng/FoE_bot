import * as fs from 'fs';
import Logging from './logging'

const logging = new Logging('Data');

export default class Data {
  
  private file_location: string;
  constructor(private file_name: string) {
    this.file_location = `./data/${file_name}.json`
  }

  async set_new_data(new_data: any) {
    const logger = logging.get_logger('set_data', 'INFO', true)

    let data  = await this.get_data();
    for (let key in new_data) {
      data[key] = new_data[key]
    }
    await this.set_data(data)
    logger.debug('Successfully saved new data');
  }

  get data() {
    return this.get_data()
  }

  set data(data) {
    this.set_data(data)
  }

  async get_data() {
    const logger = logging.get_logger('read_data', 'INFO', true)
    let data: string = fs.readFileSync(this.file_location, 'utf8')

    logger.debug('data:', data);
    return JSON.parse(data);
  }
  
  async set_data(data) {
    const logger = logging.get_logger('write_data', 'INFO', true)
    fs.writeFile(this.file_location, JSON.stringify(data, null, 2), err => {
      if (err) throw err;
      logger.debug('File successfully saved');
    });
  }

}
