const get_screenshot = require("./functions/screenshot");
const spawn_python = require("./functions/spawn_python");

class Initializer {
  constructor() {
    this.initialize();
  }

  async initialize() {
    this.webview_region = await this.get_webview_region();
    // console.log('this.webview_region', this.webview_region);
    this.scale = await this.get_scale_and_check_logged_in(this.webview_region)
    // console.log('this.scale', this.scale);
    
    if (this.scale) {
      this.roi_region = await this.get_roi_region(this.scale, this.webview_region)
      // console.log('this.roi_region', this.roi_region);
    } else {
      this.message = 'You need to log in.'
      // console.log('this.message', this.message);
    }
  }

  async get_webview_region() {
    document.getElementById('webview').style.borderColor = "rgb(0, 255, 0)"
    await get_screenshot("screen.png");
    document.getElementById('webview').style.borderColor = "rgb(0, 0, 0)"
    let region = await spawn_python("get_webview_region");
    return region
  }

  async get_scale_and_check_logged_in(webview_region) {
    let data = await spawn_python("get_scale_and_check_logged_in", webview_region);
    if (data.result === true) {
      return data.scale;
    } else if (data.result == 'press arrow_up') {
      let data = await spawn_python("find_template", 'arrow_up', data.scale, webview_region);
      return data.scale;
    } else {
      return false;
    }
  }

  async get_roi_region(scale, webview_region) {
    let roi_region = await spawn_python("get_roi_region", scale, webview_region);
    return roi_region
  }
}

module.exports = Initializer;