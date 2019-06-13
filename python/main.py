import sys
import json
import cv2

str_template = sys.argv[1]


template = cv2.imread(f'img/{str_template}.png')
screen = cv2.imread('img.png')

result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
_, prob, _, loc = cv2.minMaxLoc(result)

data = {
    'prob': prob,
    'loc': loc,
}

print(json.dumps(data))
