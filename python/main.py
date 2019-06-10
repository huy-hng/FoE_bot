import sys
import time

import cv2

args = sys.argv[1]

print(args)

img = cv2.imread('img.png')
print(img.shape)
