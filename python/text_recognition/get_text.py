import time
from functools import wraps

import numpy as np
import pytesseract
import cv2
from imutils.object_detection import non_max_suppression

WIDTH = 320
HEIGHT = 320
PADDING = 0.05
MIN_CONFIDENCE = 0.8


def timer(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        t1 = time.perf_counter()
        result = function(*args, **kwargs)
        t2 = time.perf_counter()
        print('{} ran in: {} sec'.format(function.__name__, round(t2 - t1, 4)))
        return result

    return wrapper


def crop_image(img, tol=0):
    # img is 2D image data
    # tol  is tolerance
    mask = img > tol
    return img[np.ix_(mask.any(1), mask.any(0))]


def threshold(image, color, tolerance=20):
  b, g, r = color

  lowerb = np.array([b-tolerance, g-tolerance, r-tolerance])
  upperb = np.array([b+tolerance, g+tolerance, r+tolerance])
  filtered = cv2.inRange(image, lowerb, upperb)
  return filtered 

def main():
  # image = cv2.imread('python/text_recognition/spielen_cropped.png')
  image = cv2.imread('python/text_recognition/images/servers.png')

  filtered = threshold(image, [194, 217, 255], 40)
  blur = 3
  blurred = cv2.blur(filtered, (blur, blur))
  image = cv2.bitwise_and(image, image, mask=filtered)
  # blurred = crop_image(blurred)
  # image = cv2.cvtColor(filtered, cv2.COLOR_GRAY2BGR)
  cv2.imshow('filtered', filtered)
  # cv2.imshow('masked', masked)
  cv2.imshow('image', image)
  cv2.waitKey(0)

  bboxes = get_text_bboxes(image)
  results = text_recognition(bboxes, image)
  loop_over_results(results, image)

#region get_text_bboxes
def get_text_bboxes(image):
  scores, geometry = east_text_detection(image)
  # decode the predictions, then  apply non-maxima suppression to
  # suppress weak, overlapping bounding boxes
  (rects, confidences) = decode_predictions(scores, geometry)
  bboxes = non_max_suppression(np.array(rects), probs=confidences)

  bboxes = normalize_and_pad_bboxes(bboxes, image)

  return bboxes

@timer
def east_text_detection(image):
  # define the two output layer names for the EAST detector model that
  # we are interested -- the first is the output probabilities and the
  # second can be used to derive the bounding box coordinates of text
  layerNames = [
      "feature_fusion/Conv_7/Sigmoid",
      "feature_fusion/concat_3"]

  # load the pre-trained EAST text detector
  print("[INFO] loading EAST text detector...")
  net = cv2.dnn.readNet(
      'python/text_recognition/frozen_east_text_detection.pb')

  # construct a blob from the image and then perform a forward pass of
  # the model to obtain the two output layer sets
  resized = cv2.resize(image, (WIDTH, HEIGHT))

  (H, W) = resized.shape[:2]
  blob = cv2.dnn.blobFromImage(resized, 1.0, (W, H),
                               (123.68, 116.78, 103.94),
                               swapRB=True, crop=False)
  net.setInput(blob)
  (scores, geometry) = net.forward(layerNames)
  return scores, geometry

def decode_predictions(scores, geometry):
  # grab the number of rows and columns from the scores volume, then
  # initialize our set of bounding box rectangles and corresponding
  # confidence scores
  (numRows, numCols) = scores.shape[2:4]
  rects = []
  confidences = []

  # loop over the number of rows
  for y in range(0, numRows):
    # extract the scores (probabilities), followed by the
    # geometrical data used to derive potential bounding box
    # coordinates that surround text
    scoresData = scores[0, 0, y]
    xData0 = geometry[0, 0, y]
    xData1 = geometry[0, 1, y]
    xData2 = geometry[0, 2, y]
    xData3 = geometry[0, 3, y]
    anglesData = geometry[0, 4, y]

    # loop over the number of columns
    for x in range(0, numCols):
      # if our score does not have sufficient probability,
      # ignore it
      if scoresData[x] < MIN_CONFIDENCE:
        continue

      # compute the offset factor as our resulting feature
      # maps will be 4x smaller than the input image
      (x_offset, y_offset) = (x * 4.0, y * 4.0)

      # extract the rotation angle for the prediction and
      # then compute the sin and cosine
      angle = anglesData[x]
      cos = np.cos(angle)
      sin = np.sin(angle)

      # use the geometry volume to derive the width and height
      # of the bounding box
      h = xData0[x] + xData2[x]
      w = xData1[x] + xData3[x]

      # compute both the starting and ending (x, y)-coordinates
      # for the text prediction bounding box
      xmax = int(x_offset + (cos * xData1[x]) + (sin * xData2[x]))
      ymax = int(y_offset - (sin * xData1[x]) + (cos * xData2[x]))
      xmin = int(xmax - w)
      ymin = int(ymax - h)

      # add the bounding box coordinates and probability score
      # to our respective lists
      rects.append((xmin, ymin, xmax, ymax))
      confidences.append(scoresData[x])

  # return a tuple of the bounding boxes and associated confidences
  return (rects, confidences)

def normalize_and_pad_bboxes(bboxes, image):

  input_width = image.shape[1]
  input_height = image.shape[0]

  relative_width = input_width / float(WIDTH)
  relative_height = input_height / float(HEIGHT)

  new_bboxes = []
  for (xmin, ymin, xmax, ymax) in bboxes:
    # scale the bounding box coordinates based on the respective
    # ratios
    xmin = int(xmin * relative_width)
    ymin = int(ymin * relative_height)
    xmax = int(xmax * relative_width)
    ymax = int(ymax * relative_height)

    # in order to obtain a better OCR of the text we can potentially
    # apply a bit of padding surrounding the bounding box -- here we
    # are computing the deltas in both the x and y directions
    padding_dx = int((xmax - xmin) * PADDING)
    padding_dy = int((ymax - ymin) * PADDING)

    # apply padding to each side of the bounding box, respectively
    xmin = max(0, xmin - padding_dx)
    ymin = max(0, ymin - padding_dy)
    xmax = min(input_width, xmax + (padding_dx * 2))
    ymax = min(input_height, ymax + (padding_dy * 2))

    new_bboxes.append([xmin, ymin, xmax, ymax])

  return new_bboxes
#endregion get_text_bboxes


@timer
def text_recognition(boxes, image):

  results = []
  # loop over the bounding boxes
  for (xmin, ymin, xmax, ymax) in boxes:

    # extract the actual padded ROI
    roi = image[ymin:ymax, xmin:xmax]

    # in order to apply Tesseract v4 to OCR text we must supply
    # (1) a language, (2) an OEM flag of 4, indicating that the we
    # wish to use the LSTM neural net model for OCR, and finally
    # (3) an OEM value, in this case, 7 which implies that we are
    # treating the ROI as a single line of text
    config = ("-l eng --oem 1 --psm 7")
    pytesseract.pytesseract.tesseract_cmd = 'python/text_recognition/Tesseract-OCR/tesseract'
    text = pytesseract.image_to_string(roi, config=config)

    # add the bounding box coordinates and OCR'd text to the list
    # of results
    results.append(((xmin, ymin, xmax, ymax), text))

  # sort and return the results bounding box coordinates from top to bottom
  return sorted(results, key=lambda r: r[0][1])


def loop_over_results(results, image):

    # loop over the results
  for ((xmin, ymin, xmax, ymax), text) in results:
    # display the text OCR'd by Tesseract
    # print("OCR TEXT")
    # print("========")
    print(f"{text}")
    if text == 'SPIELEN':
      print(text)
      print(xmin, ymin, xmax, ymax)
      xmid = int((xmax - xmin) / 2) + xmin
      ymid = int((ymax - ymin) / 2) + ymin
      cv2.rectangle(image, (xmid, ymid), (xmid, ymid), (0, 255, 0), 10)

    # strip out non-ASCII text so we can draw the text on the image
    # using OpenCV, then draw the text and a bounding box surrounding
    # the text region of the input image
    text = "".join([c if ord(c) < 128 else "" for c in text]).strip()
    # output = orig.copy()
    cv2.rectangle(image, (xmin, ymin), (xmax, ymax),
                  (0, 255, 0), 1)
    cv2.putText(image, text, (xmin, ymin - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 1)

    # show the output image
  cv2.imshow("Text Detection", image)
  cv2.waitKey(0)






main()
