import cv2

def match_template(screen, template, scale):
    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    height, width, _ = template_resized.shape

    result = cv2.matchTemplate(screen, template_resized, cv2.TM_CCOEFF_NORMED)
    _, prob, _, loc = cv2.minMaxLoc(result)

    return prob, loc


def get_roi_coords():
  screen = cv2.imread('screen.png')

  width, height, _ = img_previous.shape

  click_img([], img_up_arrow)

  prob, loc_guild = match_template(screen, img_guild)
  _, loc_prev = match_template(screen, img_previous)
  _, loc_next = match_template(screen, img_next)

  roi_coords = [
      loc_prev[0] - 20,
      loc_guild[1] - 20,
      loc_next[0] + width + 20,
      (loc_next[1] - loc_guild[1]) + loc_next[1] + height
  ]

  return roi_coords

def 