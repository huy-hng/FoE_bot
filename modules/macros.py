import time
import os
import pickle

import consolemenu as cm
import consolemenu.items as cm_items
import pyautogui
import win32api, win32con

from vk_codes import VK_CODE, BINDABLE_keys



class Macros:
    def __init__(self):

        if os.path.isfile('data/macros.data'):
            with open('data/macros.data', 'rb') as f:
                self.presets = pickle.load(f)
        else:
            self.presets = {}

        self.preset_menu()

    def test(self):
        print('asd')

    def preset_menu(self):
        menu = cm.ConsoleMenu('Macros', 'Set mouse positions as macros.')

        if self.presets:
            for key in self.presets:
                preset = cm_items.FunctionItem(key, input, self.presets[key])
                menu.append_item(preset)
        else:
            # presets = cm_items.MenuItem('No presets yet. Create a blank one below.')
            no_preset = cm_items.FunctionItem('No presets yet. Create a blank one below.', lambda: print('asd'))
            menu.append_item(no_preset)


        # submenu_item = cm_items.SubmenuItem('Submenu item', selection_menu, menu)



        menu.show()



    def main(self):
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

# Macros()






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
