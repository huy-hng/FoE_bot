import cv2
import numpy as np

import helpers
import logger

def find_template(str_template, scale, webview_region, roi_region=None):

  screen = helpers.read_img(region=webview_region)
  # if roi_region is not None:
  #     screen = crop_image(screen, roi_region)

  template = cv2.imread(f'templates/{str_template}.png')

  try:
    webview_height, webview_width, _ = screen.shape
    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    template_height, template_width, _ = template_resized.shape

    result = cv2.matchTemplate(
        screen, template_resized, cv2.TM_CCOEFF_NORMED)
    _, prob, _, loc = cv2.minMaxLoc(result)
  except Exception as e:
    logger.error('find_template error', str_template, scale, webview_region)

  float_loc = [(loc[0] + template_width / 2) / webview_width,
               (loc[1] + template_height / 2) / webview_height]

  # if roi_region is not None:
  #     coord[0] += roi_region[0]
  #     coord[1] += roi_region[2]

  data = {
      'prob': prob,
      'coord': float_loc,
  }
  return data


def find_all_template_locations(str_template, scale, webview_region, roi_region=None):

    screen = helpers.read_img(region=webview_region)
    if roi_region is not None:
        screen = helpers.crop_image(screen, roi_region)

    template = cv2.imread(f'img/{str_template}.png')

    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    height, width, _ = template_resized.shape

    result = cv2.matchTemplate(screen, template_resized, cv2.TM_CCOEFF_NORMED)
    loc = np.where(result >= 0.8)
    logger.debug(result)
    coords = []
    for pt in zip(*loc[::-1]):
        coords.append([int(pt[0] + width / 2), int(pt[1] + height / 2)])

    data = {
        'coords': coords,
    }
    return data
