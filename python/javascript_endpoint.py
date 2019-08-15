import cv2
import numpy as np

import helpers
import logger


def find_template_base(str_template, scale, webview_region, roi_region=None):
  webview = helpers.read_img(region=webview_region)
  webview_shape = webview.shape
  if roi_region is not None:
      webview = helpers.crop_image(webview, roi_region)

  template = cv2.imread(f'templates/{str_template}.png')

  try:

    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    template_shape = template_resized.shape

    result = cv2.matchTemplate(webview, template_resized, cv2.TM_CCOEFF_NORMED)

  except Exception as e:
    logger.error('find_template error', str_template, scale, webview_region)

  return result, webview_shape, template_shape


def find_template(str_template, scale, webview_region, roi_region=None):
  """ returns coord with values between 0 and 1 """

  result, webview_shape, template_shape = find_template_base(
      str_template, scale, webview_region, roi_region)

  _, prob, _, loc = cv2.minMaxLoc(result)
  webview_height, webview_width, _ = webview_shape
  template_height, template_width, _ = template_shape

  x = loc[0] + template_width / 2
  y = loc[1] + template_height / 2

  if roi_region is not None:
    x += roi_region[0]
    y += roi_region[2]


  float_point = [x / webview_width, y / webview_height]
  logger.debug(x, y)

  data = {
      'prob': prob,
      'coord': float_point,
  }
  return data


def find_all_template_locations(str_template, scale, webview_region, roi_region=None):

  result, webview_shape, template_shape = find_template_base(
      str_template, scale, webview_region, roi_region)

  webview_height, webview_width, _ = webview_shape
  template_height, template_width, _ = template_shape

  loc = np.where(result >= 0.8)
  logger.debug(result)
  points = []
  for pt in zip(*loc[::-1]):
    x = pt[0] + template_width / 2
    y = pt[1] + template_height / 2
    
    if roi_region is not None:
      x += roi_region[0]
      y += roi_region[2]

    points.append([x / webview_width, y / webview_height])

  data = {
      'points': points,
  }
  return data
