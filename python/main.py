import sys
import json

import cv2
import numpy as np


#region javascript endpoint
def find_template(str_template, scale, webview_region, roi_region=None):

    screen = read_img(region=webview_region)
    if roi_region is not None:
        screen = crop_image(screen, roi_region)

    template = cv2.imread(f'templates/{str_template}.png')

    try:
        template_resized = cv2.resize(template, None, fx=scale, fy=scale)
        height, width, _ = template_resized.shape

        result = cv2.matchTemplate(screen, template_resized, cv2.TM_CCOEFF_NORMED)
        _, prob, _, loc = cv2.minMaxLoc(result)
    except Exception as e:
        error('find_template error', str_template, scale, webview_region)

    coord = [int(loc[0] + width  / 2),
             int(loc[1] + height / 2)]

    if roi_region is not None:
        coord[0] += roi_region[0]
        coord[1] += roi_region[2]

    data = {
        'prob': prob,
        'coord': coord,
    }
    return data


def find_all_template_locations(str_template, scale, webview_region, roi_region=None):

    screen = read_img(region=webview_region)
    if roi_region is not None:
        screen = crop_image(screen, roi_region)

    template = cv2.imread(f'img/{str_template}.png')

    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    height, width, _ = template_resized.shape

    result = cv2.matchTemplate(screen, template_resized, cv2.TM_CCOEFF_NORMED)
    loc = np.where(result >= 0.8)
    debug(result)
    coords = []
    for pt in zip(*loc[::-1]):
        coords.append([int(pt[0] + width / 2), int(pt[1] + height / 2)])

    data = {
        'coords': coords,
    }
    return data


def check_last_page(webview_region, roi_region):
    screen_webview = read_img('screen.png', webview_region)
    screen_roi = crop_image(screen_webview, roi_region)

    next_screen_webview = read_img('next_screen.png', webview_region)
    next_screen_roi = crop_image(next_screen_webview, roi_region)

    result = cv2.matchTemplate(screen_roi, next_screen_roi, cv2.TM_CCOEFF_NORMED)
    _, prob, _, _ = cv2.minMaxLoc(result)

    return prob

#endregion

#region initializer
def get_webview_region(*_):
    """ Stand alone function """
    screen = read_img('screen.png')
    # function: threshold green
    threshold_green = lambda screen: cv2.inRange(
        screen, 
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

    return [xmin, xmax, ymin, ymax]


def get_scale_and_check_logged_in(webview_region):
    in_game_prob = []
    for scale in np.linspace(0.8, 1.2, 10)[::-1]:
        # loop through various scales to get probability
        data = find_template('in_game', scale, webview_region)
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
    loc_guild = find_template('helping/guild', scale, webview_region)['coord']
    loc_prev = find_template('navigation/previous', scale, webview_region)['coord']
    loc_next = find_template('navigation/next', scale, webview_region)['coord']

    roi_region = [
        loc_prev[0] - 20,
        loc_next[0] + 20,
        loc_guild[1] - 20,
        webview_region[3] - webview_region[2]
    ]
    return roi_region

def check_roi_on_screen(scale, webview_region):
    prob_down = find_template('navigation/down', scale, webview_region)['prob']
    if prob_down > 0.8:
        return 1

    prob_up = find_template('navigation/up', scale, webview_region)['prob']
    if prob_up > 0.8:
        return 0.5

    return 0

#endregion


#region logging
def debug(*args):
    print('DEBUG:', *args)

def info(*args):
    print('INFO:', *args)

def warn(*args):
    print('WARN:', *args)


def error(*args):
    print('ERROR:', *args)
#endregion

#region helpers



def read_img(name='screen.png', region=None):
    screen = cv2.imread(f'temp/{name}')
    if region is not None:
        screen = crop_image(screen, region)
    return screen


def crop_image(screen, region):

    xmin = region[0]
    xmax = region[1]
    ymin = region[2]
    ymax = region[3]
    webview = screen[ymin:ymax, xmin:xmax]
    return webview


def show_img(img, name=''):
    cv2.imshow(name, img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def show_images(*images):
    for i, image in enumerate(images):
        cv2.imshow(str(i), image)

    cv2.waitKey(0)
    cv2.destroyAllWindows()
#endregion helpers

if __name__ == '__main__':
    script = sys.argv[1]
    args = sys.argv[2]
    args = json.loads(args)

    info(f'script: {script} with args: {args}', )

    #pylint: disable=E0602
    exec(f'data = {script}(*{args})')
    print(json.dumps(data))
