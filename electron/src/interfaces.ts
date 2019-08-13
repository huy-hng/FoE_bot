export interface Initialize {
  success: boolean;
  scale: number;
  webview_region: number[];
  roi_region?: number[];
  message: string;
}

export interface WebviewData {
  scale: number;
  webview_region: number[];
  roi_region?: number[]
}