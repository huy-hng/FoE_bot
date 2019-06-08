import sys
from base64 import b64decode
# import cv2

print(sys.stdin)

data_uri = sys.argv[1]

print(type(data_uri))

# # # data = 'MY BASE64-ENCODED STRING'

# # # data_uri = "data:image/png;base64,iVBORw0KGg..."
# # header, encoded = data_uri.split(",", 1)
# # print(encoded)
# # data = b64decode(encoded)

# # with open("image.png", "wb") as f:
# #     f.write(data)

print('From Python')
# # print(data.shape)
# print('End Python')

sys.stdout.flush()
