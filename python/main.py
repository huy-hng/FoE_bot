import sys
import cv2

# data_uri = sys.argv[1]

img = cv2.imread('img.png')
cv2.imshow('image', img)

print(img.shape)
cv2.waitKey(0)
cv2.destroyAllWindows()

sys.stdout.flush()
