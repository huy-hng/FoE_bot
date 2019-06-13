import sys
import json

import cv2
import numpy as np

str_template = sys.argv[1]


template = cv2.imread(f'img/{str_template}.png')
screen = cv2.imread('img.png')

# for scale in np.linspace(0.8, 0.82, 40)[::-1]:

scale = 0.81
template_copy = cv2.resize(template.copy(), None, fx=scale, fy=scale)
height, width, _ = template_copy.shape

result = cv2.matchTemplate(screen, template_copy, cv2.TM_CCOEFF_NORMED)
# print(result)
_, prob, _, coord = cv2.minMaxLoc(result)
# print(f'scale: {round(scale, 4)}| prob: {round(prob, 4)} | coord: {coord}')

    # coord_2 = (int(coord[0] + width), int(coord[1] + height))
    # cv2.rectangle(screen, coord, coord_2, (0,255,0), 1)

middle = (int(coord[0] + width / 2), int(coord[1] + height / 2))

data = {
    'prob': prob,
    'coord': coord,
}

print(json.dumps(data))
        # break
        
# print(coord)


# cv2.imshow('screen', screen)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# coord[0] += width / 2
# coord[1] += height / 2




