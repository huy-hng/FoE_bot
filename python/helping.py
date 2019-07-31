import cv2
import helpers

def check_last_page(webview_region, roi_region):
  screen_webview = helpers.read_img('screen.png', webview_region)
  screen_roi = helpers.crop_image(screen_webview, roi_region)

  next_screen_webview = helpers.read_img('next_screen.png', webview_region)
  next_screen_roi = helpers.crop_image(next_screen_webview, roi_region)

  result = cv2.matchTemplate(
      screen_roi, next_screen_roi, cv2.TM_CCOEFF_NORMED)
  _, prob, _, _ = cv2.minMaxLoc(result)

  return prob
