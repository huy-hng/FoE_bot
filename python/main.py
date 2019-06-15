import sys
import json

import cv2
import numpy as np


def crop_image(img):
    # function: threshold green
    threshold_green = lambda img: cv2.inRange(img, np.array([[0,220,0]]), np.array([20,255,20]))

    thresholded = threshold_green(img)

    # get all pixels that are green
    green_mask = thresholded>0
    # crop image with green mask
    webview_and_greenborder = img[np.ix_(green_mask.any(1), green_mask.any(0))]

    # get green border again
    thresholded = threshold_green(webview_and_greenborder)
    #reverse image
    img_inv = cv2.bitwise_not(thresholded)
    mask = img_inv>0

    #remove green border
    webview = webview_and_greenborder[np.ix_(mask.any(1), mask.any(0))]
    return webview

def find_template(webview):
    str_template = sys.argv[1]
    # str_template = 'help'
    template = cv2.imread(f'img/{str_template}.png')

    data = {
        'prob': 0,
        'coord': None,
    }
    for scale in np.linspace(0.9, 1.1, 1)[::-1]:
        scale = 0.9895

        template_copy = cv2.resize(template.copy(), None, fx=scale, fy=scale)
        height, width, _ = template_copy.shape

        result = cv2.matchTemplate(webview, template_copy, cv2.TM_CCOEFF_NORMED)
        # print(result)
        _, prob, _, coord = cv2.minMaxLoc(result)
        # print(f'scale: {round(scale, 4)}| prob: {round(prob, 4)} | coord: {coord}')

        if prob > 0.8:
            coord_2 = (int(coord[0] + width), int(coord[1] + height))
            cv2.rectangle(webview, coord, coord_2, (0,255,0), 1)

            middle = (int(coord[0] + width / 2), int(coord[1] + height / 2))

            data = {
                'prob': prob,
                'coord': middle,
            }
            # break
    print(json.dumps(data))


def show_img(img):
    cv2.imshow('img', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def main():
    screen = cv2.imread('img.png')
    webview = crop_image(screen)
    find_template(webview)

main()
