const get_screenshot = require("./functions/screenshot");
const spawn_python = require("./functions/spawn_python");

class Initializer {
  constructor() {
    this.initialize();
    
  }

  async initialize() {
    this.webview_region = await this.get_webview_region();
    console.log('this.webview_region', this.webview_region);

    let scale = await this.get_scale_and_check_logged_in()
    this.message;
    console.log('scale', scale);
    if (scale) {
      this.scale = scale
    } else {
      this.message = 'You need to log in.'
      // console.log(this.message);
      this.message
    }

    let roi_region = await this.get_roi_region(this.scale)
  }

  async get_webview_region() {
    document.getElementById('webview').style.borderColor = "rgb(0, 255, 0)"
    await get_screenshot("screen.png");
    document.getElementById('webview').style.borderColor = "rgb(0, 0, 0)"
    let region = await spawn_python("get_webview_region");
    return region
  }

  async get_scale_and_check_logged_in() {
    let data = await spawn_python("get_scale_and_check_logged_in");
    if (data.result == true) {
      return data.scale;
    } else if (data.result == 'press arrow_up') {
      let data = await spawn_python("find_template", 'arrow_up', data.scale);
      return data.scale;
    } else {
      return false;
    }
  }

  async get_roi_region(scale) {
    let roi_region = await spawn_python("get_roi_region", scale);
    return roi_region
  }


  //#region helper functions
  async click_img(img_name) {
    await get_screenshot("screen.png");
    let { prob, coord } = await spawn_python("find_template", img_name, this.scale);
    if (prob > 0.8) {
      await mouse_press(coord);
    }
    return prob;
  }
  //#endregion
}

module.exports = Initializer;