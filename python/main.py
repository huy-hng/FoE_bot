import sys
import time

import cv2

import sandbox.python.templates.cv2_tools as cv2_tools

# args = sys.argv[1]
# print(args)

screen = cv2.imread('img.png')
prob, loc = cv2_tools.get_template_loc(screen, template)
print(loc)

print(img.shape)
