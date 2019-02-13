import time
import logging
import os
# from collections import OrderedDict

import cv2
import numpy as np
import win32api, win32con

import __init__
from huys_code.python.templates.huys_logging_simple import Logging
import huys_code.python.templates.cv2_tools as cv2_tools

from grabscreen import grab_screen
from vk_codes import VK_CODE


logging = Logging('FoE', 'debug', filter_str='', create_file=False)


#region images
img_last = cv2.imread('img/last.png')
img_first = cv2.imread('img/first.png')

img_previous = cv2.imread('img/previous.png')
img_next = cv2.imread('img/next.png')

img_friends = cv2.imread('img/friends_tab.png')
img_guild = cv2.imread('img/guild_tab.png')
img_neighbors = cv2.imread('img/neighbors_tab.png')

img_up_arrow = cv2.imread('img/up_arrow.png')

img_help = cv2.imread('img/help.png')
img_close = cv2.imread('img/close.png')
img_tavern = cv2.imread('img/tavern.png')

img_top_right = cv2.imread('img/top_right.png')
img_bot_left = cv2.imread('img/bot_left.png')
#endregion images



#region helpers

#region mouse
def move_click(coord, click=True):
    win32api.SetCursorPos(coord)
    if click:
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)



def click_img(roi, img, threshold=0.8, wait=0):
    time.sleep(wait)
    screen = grab_screen(roi)
    prob, loc = cv2_tools.get_template_loc(screen, img)

    height, width, _ = img.shape
    if not roi:
        roi = [0,0]
    coord = [int(loc[0] + roi[0] + (width / 2)),
             int(loc[1] + roi[1] + (height / 2))]

    # logger.debug(f'click_img coord: {coord}')
    
    if prob > threshold:
        move_click(coord)

    return prob
#endregion mouse


def is_loading(normal_screen):
    # if loading or random drop
    normal_sum = np.sum(normal_screen)
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
            click()
            time.sleep(0.2)
        else:
            logger.info('finished loading\n')
            break
        
        #time.sleep(0.1)


def key_pressed(key):
    return win32api.GetAsyncKeyState(VK_CODE[key])


# # @timer
# def get_template_loc(screen, template):
#     """ 
#     input: screen, the big img
#     input2: template, the smaller img
        
#     output: prob, loc 
#     """
#     logger = logging.get_logger('cv2_tools.get_template_loc')

#     result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
#     _, prob, _, loc  = cv2.minMaxLoc(result)

#     logger.debug(f'normal prob: {prob}')



#     result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
#     _, prob, _, loc  = cv2.minMaxLoc(result)
    

#     return prob, loc


def pause():
    print('Paused. Press Esc to unpause.')
    time.sleep(0.5)
    while True:
        time.sleep(0.05)
        if key_pressed('esc'):
            print('Unpaused')
            break

#endregion helpers



#region initializers
def start_menu():

    def show_menu(menu):
        os.system('cls')
        print('F1 Neighbors?', menu['neighbors'])
        print('F2 Guild members?', menu['guild'])
        print('F3 Friends?', menu['friends'])
        print('F4 Tavern?', menu['tavern'])

        print('\nPress Enter to continue.\n')

    def toggle(ppl_group):
        menu[ppl_group] = not menu[ppl_group]
        show_menu(menu)

    menu = {
        'neighbors': False,
        'guild': True,
        'friends': True,
        'tavern': True
    }
    
    show_menu(menu)

    while True:
        if key_pressed('F1'):
            toggle('neighbors')
        elif key_pressed('F2'):
            toggle('guild')
        elif key_pressed('F3'):
            toggle('friends')
        elif key_pressed('F4'):
            toggle('tavern')
        elif key_pressed('enter'):

            break

        time.sleep(0.05)


    ppl_to_help = []
    if menu['friends']:
        ppl_to_help.append('friends')
    if menu['tavern']:
        ppl_to_help.append('tavern')
    if menu['guild']:
        ppl_to_help.append('guild')
    if menu['neighbors']:
        ppl_to_help.append('neighbors')

    return ppl_to_help

def is_foe_opened():

    print('Open FoE and press Spacebar to start')
    print('Press Esc to pause.')

    while True:
        prob, _ = cv2_tools.get_template_loc(grab_screen(), img_guild)
        time.sleep(0.1)
        if prob > 0.95:
            if key_pressed('spacebar'):
                break


def set_window_coords():
    screen = grab_screen()
    time.sleep(0.05)

    width, height, _ = img_previous.shape

    click_img([], img_up_arrow)

    _, loc_guild = cv2_tools.get_template_loc(screen, img_guild)
    _, loc_prev = cv2_tools.get_template_loc(screen, img_previous)
    _, loc_next = cv2_tools.get_template_loc(screen, img_next)

    # _, loc_bot_left = cv2_tools.get_template_loc(screen, img_bot_left)
    # _, loc_top_right = cv2_tools.get_template_loc(screen, img_top_right)

    # window_coords = [
    #     loc_bot_left[0] - 20,
    #     loc_top_right[1] - 20,
    #     loc_top_right[0] + width + 20,
    #     loc_bot_left[1] + height + 20
    # ]

    roi_coords = [
        loc_prev[0] - 20,
        loc_guild[1] - 20,
        loc_next[0] + width + 20,
        (loc_next[1] - loc_guild[1]) + loc_next[1] + height
    ]

    print(f'ROI: {roi_coords}')

    return roi_coords
#endregion initializers



#region main
def help_all_selected(roi_coords, ppl_to_help):

    amount_help = 0
    amount_tav = 0

    for ppl in ppl_to_help:
        if ppl == 'friends':
            click_img(roi_coords, img_friends)
            #TODO: intelligent wait for stuff to load
            click_img(roi_coords, img_first, wait=1)
            amount_help = click_all_pages(roi_coords, img_help, amount_help)
        elif ppl == 'tavern':
            click_img(roi_coords, img_friends)
            click_img(roi_coords, img_first, wait=2)
            amount_tav = click_all_pages(roi_coords, img_tavern, amount_tav)
        elif ppl == 'guild':
            click_img(roi_coords, img_guild)
            click_img(roi_coords, img_first, wait=2)
            amount_help = click_all_pages(roi_coords, img_help, amount_help)
        elif ppl == 'neighbors':
            click_img(roi_coords, img_neighbors)
            click_img(roi_coords, img_first, wait=2)
            amount_help = click_all_pages(roi_coords, img_help, amount_help)


def click_all_pages(roi_coords, img_to_click, amount_pressed):

    def click_page():
        prob_img = 1
        while prob_img > 0.8:
            prob_img = click_img(roi_coords, img_to_click)
            
            print(f'prob_img {prob_img}')
            time.sleep(0.1)

            if key_pressed('esc'):
                pause()

    prob_last_page = 0

    while prob_last_page < 0.9:

        click_page()

        screen = grab_screen(roi_coords)
        click_img(roi_coords, img_next)
        time.sleep(0.5)
        screen_next = grab_screen(roi_coords)

        prob_last_page, _ = cv2_tools.get_template_loc(screen_next, screen)

        print(f'prob_last_page {prob_last_page}')

    return amount_pressed



#endregion

def main():
    ppl_tp_help = start_menu()
    is_foe_opened()
    roi_coords = set_window_coords()

    help_all_selected(roi_coords, ppl_tp_help)


# main()

def show_img(name, img):
    cv2.imshow(name, cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

def wait_img():
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def cut_img(screen, img, loc):
    height, width, _ = img.shape

    xmin = loc[0]
    ymin = loc[1]
    xmax = loc[0] + width
    ymax = loc[1] + height
    screen = screen[ymin:ymax, xmin:xmax]
    return screen

def test():
    is_foe_opened()
    roi_coords = set_window_coords()

    while True:
        if key_pressed('spacebar'):
            screen = grab_screen(roi_coords)
            
            normal_sum = np.sum(screen)
            prob_help, loc_help = cv2_tools.get_template_loc(screen, img_help)
            prob_tav, loc_tav = cv2_tools.get_template_loc(screen, img_tavern)


            print(f'prob_help = {prob_help:4f}')
            print(f'prob_tav = {prob_tav:4f}')
            print(f'normal_sum = {normal_sum}')
            print()

            help_img = cut_img(screen, img_help, loc_help)
            tav_img = cut_img(screen, img_tavern, loc_tav)
            show_img('1', screen)
            show_img('2', help_img)
            show_img('3', tav_img)

            wait_img()



# import sys
# print(sys.executable)
test()
