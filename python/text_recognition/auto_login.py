import cv2
import numpy as np


screen = cv2.imread('python/text_recognition/images/servers.png')
copy = screen.copy()
template = cv2.imread('python/text_recognition/images/server_button.png')
template = cv2.Canny(template, 200, 200)
screen = cv2.Canny(screen, 200, 200)

height, width = template.shape[:2]

result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
loc = np.where(result >= 0.65)

for pt in zip(*loc[::-1]):
  x = int(pt[0] + width / 2)
  y = int(pt[1] + height / 2)
  cv2.rectangle(copy, (x, y), (x, y), (0, 255, 0), 5)

_, prob, _, loc = cv2.minMaxLoc(result)
print(prob)
x = int(loc[0] + width / 2)
y = int(loc[1] + height / 2)
cv2.rectangle(copy, (x, y), (x, y), (0, 0, 255), 5)


cv2.imshow('screen', screen)
cv2.imshow('copy', copy)
cv2.imshow('template', template)
cv2.waitKey(0) 
