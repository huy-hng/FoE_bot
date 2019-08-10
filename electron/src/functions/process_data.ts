import * as fs from 'fs';
import Logging from './logging'

const logging = new Logging('data');

export default class Data {
  
  private file_location: string;
  constructor(private file_name: string) {
    this.file_location = `../../data/${file_name}`
  }

  get data() {
    return this.read_data()
  }

  set data(data) {
    this.write_data(data)
  }
  async read_data() {
    const logger = logging.get_logger('read_data', 'DEBUG', true)
    fs.readFile(this.file_location, 'utf8', (err, data) => {
      if (err)
        throw err;
        logger.debug('data:', data);
      return JSON.parse(data);
    });
  }
  
  async write_data(data) {
    const logger = logging.get_logger('write_data', 'DEBUG', true)
    fs.writeFile(this.file_location, JSON.stringify(data), err => {
      if (err) throw err;
      logger.debug('File successfully saved');
    });
  }

}
