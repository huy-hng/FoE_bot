import time
import os
import pickle

import consolemenu as cm
import consolemenu.items as cm_items
import pyautogui
import win32api, win32con

from vk_codes import VK_CODE, BINDABLE_keys



def key_pressed(key):
    return win32api.GetAsyncKeyState(VK_CODE[key])

def move_click(coord, click=True):
    win32api.SetCursorPos(coord)
    if click:
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)
        # time.sleep(0.1)

def change_coord(coords):
    print('Press a key to set new coordinate.')
    while True:
        x, y = pyautogui.position()
        coord = [x, y]
        time.sleep(0.05)

        for k, _ in coords.items():
            if key_pressed(f'{k}'):
                coords[f'{k}'] = coord

                for key, val in coords.items():
                    if val is not None:
                        print(f'{key}: {val[0]}, {val[1]}')

                return

            if key_pressed('esc'):
                return

def init_coords():
    coords = {}
    for key in BINDABLE_keys:
        if key == 'numpad_7':
            coords[key] = [913, 142]
        elif key == 'numpad_8':
            coords[key] = [961, 142]
        elif key == 'numpad_9':
            coords[key] = [1009, 142]
        elif key == 'numpad_4':
            coords[key] = [60, 660]
        elif key == 'numpad_5':
            coords[key] = [160, 660]
        elif key == 'numpad_1':
            coords[key] = [60, 814]
        elif key == 'numpad_2':
            coords[key] = [160, 814]
        else:
            coords[key] = None

    return coords

def pause():
    print('Pausing')
    while True:
        time.sleep(0.2)
        if key_pressed('home'):
            print('Unpausing')
            break

def main():
    coords = init_coords()
    for key, val in coords.items():
        if val is not None:
            print(f'{key}: {val[0]}, {val[1]}')


    while True:

        for k, _ in coords.items():
            if key_pressed(f'{k}'):
                x, y = pyautogui.position()
                current_coord = [x, y]
                set_coord = coords[f'{k}']
                
                if set_coord is not None:
                    move_click(set_coord)
                    move_click(current_coord, False)
                    time.sleep(0.1)

            

        if key_pressed('F4'):
            change_coord(coords)

        if key_pressed('home'):
            pause()

        time.sleep(0.01)

main()
