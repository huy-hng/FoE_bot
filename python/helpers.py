import cv2

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