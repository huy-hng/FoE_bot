const spawn_python = require("./spawn_python");

exports.find_template = async function (str_template, scale, webview_region, roi_region=null) {
  let { prob, coord } = await spawn_python("find_template", str_template, scale, webview_region, roi_region);
  return { prob, coord }
}

exports.check_last_page = async function (webview_region, roi_region) {
  let prob = await spawn_python("check_last_page", webview_region, roi_region);
  return prob
}


//#region initialize
exports.get_scale_and_check_logged_in = async function (webview_region) {
  let scale = await spawn_python("get_scale_and_check_logged_in", webview_region);
  return scale
}

exports.get_webview_region = async function () {
  let webview_region = await spawn_python("get_webview_region");
  return webview_region
}

exports.check_roi_on_screen = async function (scale, webview_region) {
  let roi_on_screen = await spawn_python("check_roi_on_screen", scale, webview_region);
  return roi_on_screen
}

exports.get_roi_region = async function (scale, webview_region) {
  let roi_region = await spawn_python("get_roi_region", scale, webview_region);
  return roi_region
}
//#endregion

// exports.find_template = find_template;
// exports.check_last_page = check_last_page;

// exports.get_scale_and_check_logged_in = get_scale_and_check_logged_in;
// exports.get_webview_region = get_webview_region;
// exports.check_roi_on_screen = check_roi_on_screen;
// exports.get_roi_region = get_roi_region;