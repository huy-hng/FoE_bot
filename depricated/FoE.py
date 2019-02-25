import time
import logging
import random

import cv2
import numpy as np
import win32api, win32con

from grabscreen import grab_screen


#region logging
logger = logging.getLogger('FoE')
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(levelname)s:%(name)s:%(message)s')

stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.DEBUG)
stream_handler.setFormatter(formatter)

logger.addHandler(stream_handler)
#endregion logging

#region images
img_last = cv2.imread('img/last.png')
img_previous = cv2.imread('img/previous.png')

img_first = cv2.imread('img/first.png')
img_next = cv2.imread('img/next.png')

img_friends_tab = cv2.imread('img/friends_tab.png')
img_guild_tab = cv2.imread('img/guild_tab.png')
img_neighbors_tab = cv2.imread('img/neighbors_tab.png')

img_up_start = cv2.imread('img/up_start.png')

img_help = cv2.imread('img/help.png')
img_close = cv2.imread('img/close.png')
img_tavern = cv2.imread('img/tavern.png')
# = cv2.imread('.png')
#endregion images


class FoE_Bot:

    def __init__(self):

        # do neighbors?
        self.tabs = [img_friends_tab, img_guild_tab]
        once_neighbor = True
        while True:
            if random.random() < 0.05:
                neighbor_text = 'FUCK THEM NEIGHBORS?????? (y/n): '
            else:
                neighbor_text = 'Do neighbors? (y/n): '

            do_neighbors = input(neighbor_text)

            if do_neighbors == 'y':
                self.tabs.append(img_neighbors_tab)
                break
            elif do_neighbors == 'n':
                break
            else:
                if once_neighbor:
                    print("What is u doin, 'y' or 'n' u chickenwing.\n")
                    once_neighbor = False
                    twice_neighbor = True
                elif twice_neighbor:
                    print('Bitch u retarded?\n')
                    twice_neighbor = False
                else:
                    print('Ob du behindert bist hab ich gefragt.\n')

        print('Press Spacebar to start.')
        print('Press Esc to pause.')

        # check if FoE is opened
        say_goodboi = False
        while True:
            screen = grab_screen()
            time.sleep(0.05)

            width, height, _ = img_previous.shape

            result = cv2.matchTemplate(screen, img_guild_tab, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, loc_guild_tab  = cv2.minMaxLoc(result)

            result = cv2.matchTemplate(screen, img_previous, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, loc_prev = cv2.minMaxLoc(result)

            result = cv2.matchTemplate(screen, img_next, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, loc_next = cv2.minMaxLoc(result)

            self.xmin = loc_prev[0] - 20
            self.ymin = loc_guild_tab[1] - 20
            self.xmax = loc_next[0] + width + 20
            self.ymax = (loc_next[1] - loc_guild_tab[1]) + loc_next[1] + height

            self.small_screen_coord = [self.xmin, self.ymin, self.xmax, self.ymax]
            if self.xmin > 1920:
                self.big_screen = [1920, 0, 3839, 1079]
            else:
                self.big_screen = [0, 0, 1919, 1079]

            logger.info('big screen coord: {}'.format(self.big_screen))

            if max_val < 0.75:
                print('FoE is probably minimized. Open it tf up.')
                time.sleep(0.2)
                say_goodboi = True
            else:
                if say_goodboi:
                    print('Good boi')
                break


        self.moveTo(img_up_start, relative=True)
        self.main()

    def main(self):
        while True:
            time.sleep(0.1)
            
            if win32api.GetAsyncKeyState(0xA3):
                print('Cant u read? \nGet rekt bitch, right CTRl is no longer in use.\n')

            if win32api.GetAsyncKeyState(0x20):

                for tab in self.tabs:
                    
                    if np.array_equal(tab, img_friends_tab):
                        check_tavern = True
                    else: 
                        check_tavern = False
        
                    self.moveTo(tab, relative=True, threshold=0.75)
                    
                    self.moveTo(img_first, relative=True)

                    self.pressAllButtons(check_tavern)

    #region button presser
    def pressAllButtons(self, check_tavern):
        page = 1
        while True:
            # wait for page to come to a stand
            time.sleep(0.05)
            print('Page: {}'.format(page))
            page += 1
            small_screen = grab_screen(self.small_screen_coord)
            # cv2.imshow('test', small_screen)
            # cv2.waitKey(0)
            # cv2.destroyAllWindows()

            # press help buttons
            self.pressButtons(small_screen, img_help, 'help')

            # press tavern buttons
            if check_tavern:
                small_screen = grab_screen(self.small_screen_coord)
                self.pressButtons(small_screen, img_tavern, 'tav ', wait=0.2)

            time.sleep(0.1)

            # check if its the last page
            self.moveTo(img_next, relative=True)

            time.sleep(0.1)

            next_screen = grab_screen(self.small_screen_coord)

            result = cv2.matchTemplate(next_screen, small_screen, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, _ = cv2.minMaxLoc(result)
            if max_val > 0.9:
                print('Last page. Breaking.')
                if random.random() < 0.05:
                    print('*starts breakdancing*')
                break


            if win32api.GetAsyncKeyState(0x1B):
                self.pause()


    def pressButtons(self, screen, image, logging_info, wait=0.1):
        '''find buttons and click them'''
        result = cv2.matchTemplate(screen, image, cv2.TM_CCOEFF_NORMED)

        # debugging
        _, max_val, _, max_loc = cv2.minMaxLoc(result)
        logger.debug('{} prob:{}'.format(logging_info, round(max_val, 2)))

        loc = np.where(result > 0.78)
        for coord in zip(*loc[::-1]):
            logger.debug('{} coord:{}'.format(logging_info, coord))
            self.moveClick(coord, image, relative=True, wait=wait)

            #time.sleep(0.05)

            self.is_loading(screen)

            if win32api.GetAsyncKeyState(0x1B):
                self.pause()
        
    #endregion


    #region helper functions
    def is_loading(self, normal_screen):
        # if loading or random drop
        normal_sum = np.sum(normal_screen)
        timer = time.perf_counter()
        loading = False
        once = True
        time.sleep(0.1)
        while True:
            second_sum = np.sum(grab_screen(self.small_screen_coord))

            # debugging
            # if once:
            #     logger.info('normal_sum: {}'.format(normal_sum))
            #     logger.info('sums: * 0.9 {}, * 1.1 {}'.format(normal_sum*0.9, normal_sum*1.1))
            #     logger.info('second_sum: {}'.format(second_sum))
            #     once = False
            # else:
            #     logger.debug('second_sum: {}'.format(second_sum))

            if second_sum * 1.1 < normal_sum:
                #logger.info('loading')
                self.click()
                time.sleep(0.2)
            else:
                logger.info('finished loading\n')
                break
            
            #time.sleep(0.1)


 
    def moveTo(self, image, relative, threshold=0.85):
        '''move to a specific image'''
        time.sleep(0.05)

        if relative:
            screen = grab_screen(self.small_screen_coord)
        else:
            screen = grab_screen(self.big_screen)

        result = cv2.matchTemplate(screen, image, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(result)
        if max_val > threshold:
            self.moveClick(max_loc, image, relative)


    def moveClick(self, coord, image, relative, wait=0.1):
        '''move to specific coordinates'''
        height, width, _ = image.shape
        coord = [int(coord[0] + width / 2), int(coord[1] + height / 2)]

        if relative:
            coord[0] += self.xmin
            coord[1] += self.ymin
            
        logger.debug('moveClick coord: {}'.format(coord))
        win32api.SetCursorPos(coord)
        self.click(wait)


    def click(self, wait=0.05):
        time.sleep(wait) 
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)

    def pause(self):
        print('Paused. Press Esc to unpause.')
        time.sleep(0.5)
        while True:
            time.sleep(0.05)
            if win32api.GetAsyncKeyState(0x1B):
                print('Unpaused')
                break
    #endregion helper functions


    #region testing
    # def mousepos():

    #     while True:

    #         x, y = pyautogui.position()

    #         positionStr = 'X: ' + str(x).ljust(10) + ' Y: ' + str(y).ljust(30)
    #         print(positionStr, end='')
    #         print('\b' * len(positionStr), end='', flush=True)
    #         time.sleep(0.01)

    # def testPix():
    #     while True:
    #         if win32api.GetAsyncKeyState(0x0D):
    #             screen = grab_screen([0,0,1919,1079])
    #             print(screen[-1][0])
    #endregion testing

FoE_Bot()
