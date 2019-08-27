import { spawn_python } from './spawn_python';
import { WebviewData } from '../interfaces';


export async function find_template(template: string, scale: number, 
                                    webview_region: number[], roi_region?: number[]) {

  let { prob, coord }: { prob: number, coord: number[]} = await spawn_python(
    "find_template", template, scale, webview_region, roi_region);
  return { prob, coord }
}

export async function find_all_template_locations(template: string, scale: number, 
                                    webview_region: number[], roi_region?: number[]) {

  let { points } = await spawn_python(
    "find_all_template_locations", template, scale, webview_region, roi_region);
    
  return { points }
}

export async function check_last_page(webview_data: WebviewData) {
  let { webview_region, roi_region } = webview_data;
  let prob: number = await spawn_python("check_last_page", webview_region, roi_region);
  return prob
}


//#region initialize
export async function get_scale(webview_region: number[], template: string) {
  let scale: number = await spawn_python("get_scale", webview_region, template);
  return scale
}

export async function get_webview_region () {
  let webview_region: number[] = await spawn_python("get_webview_region");
  return webview_region
}

export async function check_roi_on_screen(scale: number, webview_region: number[]) {
  let roi_on_screen: number = await spawn_python("check_roi_on_screen", scale, webview_region);
  return roi_on_screen
}

export async function get_roi_region(scale: number, webview_region: number[]) {
  let roi_region: number[] = await spawn_python("get_roi_region", scale, webview_region);
  return roi_region
}
//#endregion

//#region watcher
export async function get_names(scale: number, webview_region: number[]) {
  let data = await spawn_python("get_names", scale, webview_region);
  return data
}

//#endregion