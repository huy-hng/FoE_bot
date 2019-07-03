import contextlib
import unittest
import time
import sys
from functools import wraps

sys.path.append('..')
import pytest
import cv2

#pylint: disable=E1101
import main


show_img = False

#region helpers
@contextlib.contextmanager
def timer_context(name):
    t0 = time.perf_counter()
    yield
    t1 = time.perf_counter()
    print(f'{name} ran in: {round(t1 - t0, 4)} sec')


def timer(function):
  @wraps(function)
  def wrapper(*args, **kwargs):

    # debug(f'{function.__name__}')
    t0 = time.perf_counter()
    result = function(*args, **kwargs)
    t1 = time.perf_counter()
    print(f'{function.__name__} ran in: {round(t1 - t0, 4)} sec')
    return result
  return wrapper
#endregion

#region test_initialization scenarios
@timer
def test_initialization_logged_in_and_ready():
  with timer_context('get_webview_region'):
    webview_region = main.get_webview_region()
  assert webview_region == [4, 1283, 34, 753]

  with timer_context('get_scale_and_check_logged_in'):
    scale = main.get_scale_and_check_logged_in(webview_region)
  assert scale['result']
  assert scale['scale'] == pytest.approx(1, rel=1e-1)  # 1.0105263157894737
  # print('scale:', scale['scale'])

  with timer_context('get_roi_region'):
    roi_region = main.get_roi_region(scale['scale'], webview_region)
  assert roi_region == [225, 933, 556, 719]

  if show_img:
    screen = main.read_img()
    webview = main.read_img(region=webview_region)

    roi = main.crop_image(webview, roi_region)
    main.show_images(screen, webview, roi)


def test_initialization_logged_in_but_not_ready():
  pass

def test_initialization_not_logged_in():
  pass
#endregion

#region single functions
@timer
def test_find_template():
  scale = 1.0204081632653061
  webview_region = [4, 1283, 34, 753]
  roi_region = [225, 933, 556, 719]
  data = main.find_template('help', scale, webview_region, roi_region)

  # assert data['coord'] == pytest.approx([311, 708], abs=10) # with webiew_region
  assert data['coord'] == pytest.approx([86, 152], abs=10) # with roi_region
  if show_img:
    webview = main.read_img(region=webview_region)
    roi = main.crop_image(webview, roi_region)
    coords = (data['coord'][0], data['coord'][1])
    cv2.circle(roi, coords, 3, (0, 255, 0), 2)
    main.show_img(roi)


@timer
def test_find_all_template_locations():
  scale = 1.0204081632653061
  webview_region = [4, 1283, 34, 753]
  roi_region = [225, 933, 556, 719]
  data = main.find_all_template_locations(
      'help', scale, webview_region, roi_region)

  coords = data['coords']
  print(coords)

  if show_img:
    webview = main.read_img(region=webview_region)
    roi = main.crop_image(webview, roi_region)
    for coord in coords:
      cv2.circle(roi, (coord[0], coord[1]), 3, (0, 255, 0), 2)
      
    main.show_img(roi)

@timer
def test_check_last_page():
  webview_region = [4, 1283, 34, 753]
  roi_region = [225, 933, 556, 719]
  prob = main.check_last_page(webview_region, roi_region)
  print(prob)
#endregion


if __name__ == '__main__':
  # test_initialization_logged_in_and_ready()
  # test_find_all_template_locations()
  # test_find_template()
  test_check_last_page()
  
