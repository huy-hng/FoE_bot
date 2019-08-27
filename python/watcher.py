import cv2
import numpy as np

import helpers
import javascript_endpoint as js_end
import logger


def get_lines(scale, webview_region):
  result, _, template_shape = js_end.find_template_base('golden_star', scale, webview_region)

  template_height = template_shape[0]

  loc = np.where(result >= 0.7)
  logger.debug(f'len(loc): {len(loc)}')
  lines_bboxes = []
  for pt in zip(*loc[::-1]):
    xmin = webview_region[0]
    xmax = webview_region[1]
    ymin = pt[1]
    ymax = pt[1] + template_height

    lines_bboxes.append([xmin, xmax, ymin, ymax])

  logger.debug(f'lines_bboxes: {lines_bboxes}')
  return lines_bboxes


def get_text(line_bbox):
  line_img = helpers.read_img(region=line_bbox)

  upper_b = np.array([253, 193, 63])
  lower_b = np.array([106, 70, 29])
  threshold = cv2.inRange(line_img, upper_b, lower_b)


def get_names(scale, webview_region):
  lines = get_lines(scale, webview_region)
  logger.debug('lines:', lines)

  # images = []
  for i, line_bbox in enumerate(lines):
    line_img = helpers.read_img(region=line_bbox)
    # images.append(line_img)
    logger.debug(i, line_bbox)
    helpers.show_img(line_img, str(i))
    # get_text(line_bbox) 

  return {'message': 'done'}
