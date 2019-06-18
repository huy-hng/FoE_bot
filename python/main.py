import sys
import json
import time
from functools import wraps

import cv2
import numpy as np

#region helpers
def create_debugger(should_print):
    def debug(*args):
        if should_print:
            print(*args)
    return debug


def show_img(img):
    cv2.imshow('img', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def timer(function):
    @wraps(function)
    def wrapper(*args, **kwargs):

        debug(f'{function.__name__}')
        t1 = time.perf_counter()
        result = function(*args, **kwargs)
        t2 = time.perf_counter()
        debug(f'{function.__name__} ran in: {round(t2 - t1, 4)} sec')
        return result
    return wrapper


def crop_image(screen, region):

    xmin = region[0]
    xmax = region[1]
    ymin = region[2]
    ymax = region[3]
    webview = screen[ymin:ymax, xmin:xmax]
    return webview
#endregion helpers



#region javascript endpoint
@timer
def find_template(str_template, scale):

    screen = cv2.imread('screen.png')
    template = cv2.imread(f'img/{str_template}.png')
    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    height, width, _ = template_resized.shape

    result = cv2.matchTemplate(screen, template_resized, cv2.TM_CCOEFF_NORMED)
    _, prob, _, loc = cv2.minMaxLoc(result)

    data = {
        'prob': prob,
        'coord': [int(loc[0] + width / 2), int(loc[1] + height / 2)],
    }
    return data

#region initializer
@timer
def get_webview_region(*_):
    """ Stand alone function """
    screen = cv2.imread('screen.png')
    # function: threshold green
    def threshold_green(screen): return cv2.inRange(
        screen, np.array([[0, 220, 0]]), np.array([40, 255, 40]))

    thresholded = threshold_green(screen)

    # get all pixels that are green
    green_mask = thresholded > 0
    # crop image with green mask
    greenborder_only = thresholded[np.ix_(
        green_mask.any(1), green_mask.any(0))]

    # get green border again
    # reverse image
    img_inv = cv2.bitwise_not(greenborder_only)
    # show_img(img_inv)
    mask = img_inv > 0

    coords = np.ix_(mask.any(1), mask.any(0))
    x_coords = np.squeeze(coords[1])
    y_coords = np.squeeze(coords[0])
    xmin = int(x_coords[0])
    xmax = int(x_coords[-1])
    ymin = int(y_coords[0])
    ymax = int(y_coords[-1])
    return [xmin, xmax, ymin, ymax]


@timer
def get_scale_and_check_logged_in(*_):
    def loop_through_scales(str_template):
        arrow_prob = []
        for scale in np.linspace(0.8, 1.2, 10)[::-1]:
            data = find_template(str_template, scale)
            prob = data['prob']
            if prob > 0.9:
                return [prob, scale]
            elif prob > 0.8:
                arrow_prob.append([prob, scale])

        highest_prob_data = [0, 0]
        if arrow_prob:
            highest_prob_data = sorted(
                arrow_prob, key=lambda x: x[0], reverse=True)[0]

        return highest_prob_data

    arrow_down_data = loop_through_scales('arrow_down')
    debug(arrow_down_data)
    if arrow_down_data[0] > 0.8:
        # logged in and ready
        return {'result': True, 'scale': arrow_down_data[1]}

    arrow_up_data = loop_through_scales('arrow_up')
    debug(arrow_up_data)
    if arrow_up_data[0] > 0.8:
        # logged in but not ready
        return {'result': 'press arrow_up',
                'scale': arrow_up_data[1]}

    # not logged in
    return {'result': False}

@timer
def get_roi_region(scale):

    loc_guild = find_template('img_guild', scale)['coord']
    loc_prev = find_template('img_previous', scale)['coord']
    loc_next = find_template('img_next', scale)['coord']

    roi_region = [
        loc_prev[0] - 20,
        loc_guild[1] - 20,
        loc_next[0] + 20,
        2 * loc_next[1] - loc_guild[1]
    ]

    return roi_region
#endregion


#endregion



def check_last_page():
    last_screen = cv2.imread('last_screen.png')
    screen = cv2.imread('screen.png')

    prob_last_page, _ = cv2_tools.get_template_loc(screen_next, screen)
    return prob_last_page


script = sys.argv[1]
args = sys.argv[2:]

debug = create_debugger(False)
exec(f'data = {script}(*{args})')
debug(data)
print(json.dumps(data))
