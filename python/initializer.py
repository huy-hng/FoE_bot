import cv2
import numpy as np

import helpers
import javascript_endpoint as js_end

DEBUG = True

def get_webview_region(*_):
  """ Stand alone function """
  screen = helpers.read_img('screen.png')

  # function: threshold green
  threshold_green = lambda screen: cv2.inRange(screen,
                                               np.array([[0, 220, 0]]),
                                               np.array([40, 255, 40]))

  thresholded = threshold_green(screen)

  # get all pixels that are green
  green_mask = thresholded > 0
  green_coords = np.ix_(green_mask.any(1), green_mask.any(0))
  x_coords = np.squeeze(green_coords[1])
  y_coords = np.squeeze(green_coords[0])

  border_thickness = 4
  xmin = int(x_coords[0] + border_thickness)
  xmax = int(x_coords[-1] - border_thickness)
  ymin = int(y_coords[0] + border_thickness)
  ymax = int(y_coords[-1] - border_thickness)

  if DEBUG:
    cropped = helpers.crop_image(screen, [xmin, xmax, ymin, ymax])
    cv2.imwrite('./temp/webview.png', cropped)

  return [xmin, xmax, ymin, ymax]


def get_scale(webview_region, template: str):
  template_prob = []
  for scale in np.linspace(0.8, 1.2, 10)[::-1]:
    # loop through various scales to get probability
    data = js_end.find_template(template, scale, webview_region)
    prob = data['prob']
    if prob > 0.9:
      template_prob.append([prob, scale])
      break
    elif prob > 0.8:
      template_prob.append([prob, scale])

  if template_prob:
    scale = sorted(template_prob, key=lambda x: x[0], reverse=True)[0][1]
    return scale
  return None


def get_scale_and_check_logged_in(webview_region):
  in_game_prob = []
  for scale in np.linspace(0.8, 1.2, 10)[::-1]:
    # loop through various scales to get probability
    data = js_end.find_template('in_game', scale, webview_region)
    prob = data['prob']
    if prob > 0.9:
      in_game_prob.append([prob, scale])
      break
    elif prob > 0.8:
      in_game_prob.append([prob, scale])

  if in_game_prob:
    scale = sorted(in_game_prob, key=lambda x: x[0], reverse=True)[0][1]
    return scale
  return None


def get_roi_region(scale, webview_region):
  """ region within the webview, in other words
      relative to 0/0 of webview, eventhough webview
      coords starts at 4/34 in absolute scale """

  scale = float(scale)
  loc_guild = js_end.find_template('helping/guild', scale, webview_region)['coord']
  loc_prev = js_end.find_template('navigation/previous', scale, webview_region)['coord']
  loc_next = js_end.find_template('navigation/next', scale, webview_region)['coord']

  roi_region = [
      int(loc_prev[0] * webview_region[1] - 20),
      int(loc_next[0] * webview_region[1] + 20),
      int(loc_guild[1] * webview_region[3] - 20),
      int(webview_region[3] - webview_region[2])
  ]

  return roi_region


def check_roi_on_screen(scale, webview_region):
  prob_down = js_end.find_template('navigation/down', scale, webview_region)['prob']
  if prob_down > 0.8:
    return 1

  prob_up = js_end.find_template('navigation/up', scale, webview_region)['prob']
  if prob_up > 0.8:
    return 0.5

  return 0
