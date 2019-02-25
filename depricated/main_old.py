import time

import numpy as np
import win32api, win32con
import pyautogui

from grabscreen import grab_screen

help_buttons = [[315, 1066], [420, 1066], [530, 1066], [634, 1066], [740, 1066]]
first_profile_button = [246,1048]
next_button = [915, 1015]
last_profile = [694, 986, 762, 1056]

neighbor_button = [740, 935]
guild_button = [805, 935]
friends_button = [870, 935]



tabs = [guild_button, friends_button]


def moveClick(x, y, move=True):
    if move:
        win32api.SetCursorPos([x, y])
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)  

def main():
    print('start')
    while True:

        time.sleep(0.1)
        if win32api.GetAsyncKeyState(0x0D):
            last_profile_picture = [0,0,0]
            help_buttons_index = 0
            once = False

            for tab in tabs:
                if tab == friends_button:
                    check_tavern = True
                else:
                    check_tavern = False

                x,y = tab
                moveClick(x, y)

                while True:
                    time.sleep(0.1)
                    #screen = grab_screen([0,950,930,1079])
                    screen = grab_screen([0,0,1919,1079])

                    # if loading
                    if np.array_equal(screen[-1][0], [18, 9, 3]):
                        pass
                    elif np.array_equal(screen[-1][0], [16, 7, 3]):
                        moveClick(1050, 790)

                    else:
                        # click help button
                        x, y = help_buttons[help_buttons_index]
                        moveClick(x, y)

                        # if last help button of 5 reached
                        if help_buttons_index == len(help_buttons) - 1:
                            help_buttons_index = 0
                            x, y = next_button
                            moveClick(x, y)
                            time.sleep(0.1)
                            screen = grab_screen([0,0,1919,1079])

                            profile_picture = screen[ last_profile[1]:last_profile[3], last_profile[0]:last_profile[2] ]
                            if np.array_equal(profile_picture, last_profile_picture):
                                if once:
                                    once = False
                                    break
                                once = True
                            last_profile_picture = profile_picture

                        # else next help button
                        else:
                            help_buttons_index += 1


                    if win32api.GetAsyncKeyState(0x1B):
                        break
                if win32api.GetAsyncKeyState(0x1B):
                    break


def mousepos():

    while True:

        x, y = pyautogui.position()

        positionStr = 'X: ' + str(x).ljust(10) + ' Y: ' + str(y).ljust(30)
        print(positionStr, end='')
        print('\b' * len(positionStr), end='', flush=True)
        time.sleep(0.01)

def testPix():
    while True:
        if win32api.GetAsyncKeyState(0x0D):
            screen = grab_screen([0,0,1919,1079])
            print(screen[-1][0])

main()