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

    template_resized = cv2.resize(template, None, fx=scale, fy=scale)
    height, width, _ = template_resized.shape

    result = cv2.matchTemplate(screen, template_resized, cv2.TM_CCOEFF_NORMED)
    _, prob, _, loc = cv2.minMaxLoc(result)

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
    # print(result)
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
    def loop_through_scales(str_template):
        arrow_prob = []
        for scale in np.linspace(0.8, 1.2, 10)[::-1]:
            data = find_template(str_template, scale, webview_region)
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


def get_roi_region(scale, webview_region):
    """ region within the webview, in other words
        relative to 0/0 of webview, eventhough webview
        coords starts at 4/34 in absolute scale """

    scale = float(scale)
    loc_guild = find_template('guild', scale, webview_region)['coord']
    loc_prev = find_template('previous', scale, webview_region)['coord']
    loc_next = find_template('next', scale, webview_region)['coord']

    roi_region = [
        loc_prev[0] - 20,
        loc_next[0] + 20,
        loc_guild[1] - 20,
        webview_region[3] - webview_region[2]
    ]

    # screen = read_img(region=roi_region)
    # show_img(screen)
    return roi_region
#endregion



#region helpers
def create_debugger(should_print):
    def debug(*args):
        if should_print:
            print('debug:', *args)
    return debug


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

debug = create_debugger(False)
if __name__ == '__main__':
    script = sys.argv[1]
    args = sys.argv[2]
    args = json.loads(args)

    # debug(*args)

    #pylint: disable=E0602
    exec(f'data = {script}(*{args})')
    debug(data)
    print(json.dumps(data))
