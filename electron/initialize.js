const get_screenshot = require("./functions/screenshot");
const spawn_python = require("./functions/spawn_python");



async function initialize() {
  let webview_region = await get_webview_region();
  // console.log('webview_region', webview_region);
  let scale = await get_scale_and_check_logged_in(webview_region)
  // console.log('scale', scale);
  
  let roi_region;
  let message;
  if (scale) {
    roi_region = await get_roi_region(scale, webview_region)
    // console.log('roi_region', roi_region);
  } else {
    message = 'You need to log in.'
    // console.log('message', message);
  }

  return { scale, webview_region, roi_region, message}
}

async function get_webview_region() {
  document.getElementById('webview').style.borderColor = "rgb(0, 255, 0)"
  await get_screenshot("screen.png");
  document.getElementById('webview').style.borderColor = "rgb(0, 0, 0)"
  let region = await spawn_python("get_webview_region");
  return region
}

async function get_scale_and_check_logged_in(webview_region) {
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

async function get_roi_region(scale, webview_region) {
  let roi_region = await spawn_python("get_roi_region", scale, webview_region);
  return roi_region
}

module.exports = initialize;