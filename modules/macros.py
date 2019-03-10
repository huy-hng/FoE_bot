import time
import os
import pickle
import winsound

import consolemenu as cm
import consolemenu.items as cm_items
import pyautogui
import win32api, win32con

from vk_codes import VK_CODE, BINDABLE_keys


class Preset:
    def __init__(self, name):
        self.name = name

        self.macros = {}
        for key in BINDABLE_keys:
            self.macros[key] = None


    def show_preset_menu(self):
        menu = cm.ConsoleMenu(f'{self.name}')

        macro = cm_items.MenuItem('Create new Macro')
        delete = cm_items.MenuItem('Delete Preset')
        back = cm_items.MenuItem('Back to Menu')

        menu.append_item(macro)
        menu.append_item(delete)
        menu.append_item(back)

        menu.show()



    def create_new_macro(self):
        winsound.Beep(440, 200)

        #TODO: change print statement
        print('Press a key to set new coordinate.')
        while True:
            x, y = pyautogui.position()
            coord = [x, y]
            time.sleep(0.05)

            for k, _ in self.macros.items():
                if self.key_pressed(f'{k}'):
                    self.macros[f'{k}'] = coord

                    for key, val in self.macros.items():
                        if val is not None:
                            print(f'{key}: {val[0]}, {val[1]}')

                    return

                if self.key_pressed('esc'):
                    return


    def main(self):
        
        for key, val in self.macros.items():
            if val is not None:
                print(f'{key}: {val[0]}, {val[1]}')


        while True:

            for k, _ in self.macros.items():
                if self.key_pressed(f'{k}'):
                    x, y = pyautogui.position()
                    current_coord = [x, y]
                    set_coord = self.macros[f'{k}']
                    
                    if set_coord is not None:
                        self.move_click(set_coord)
                        self.move_click(current_coord, False)
                        time.sleep(0.1)

                

            if self.key_pressed('F4'):
                change_coord(self.macros)

            if self.key_pressed('home'):
                self.pause()

            time.sleep(0.01)


    #region helpers
    @staticmethod
    def key_pressed(key):
        return win32api.GetAsyncKeyState(VK_CODE[key])

    @staticmethod
    def move_click(coord, click=True):
        win32api.SetCursorPos(coord)
        if click:
            win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
            win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)
            # time.sleep(0.1)
            
        return coords

    def pause(self):
        print('Pausing')
        while True:
            time.sleep(0.2)
            if self.key_pressed('home'):
                print('Unpausing')
                break
    #endregion




def preset_list_menu():
    if os.path.isfile('data/macros.data'):
        with open('data/macros.data', 'rb') as f:
            presets = pickle.load(f)
    else:
        presets = {}


    menu = cm.ConsoleMenu('Macros', 'Set mouse positions as macros.')

    create_preset_menu = cm_items.FunctionItem('Create new preset.', create_preset)
    menu.append_item(create_preset_menu)

    if presets:
        for key in presets:
            preset = cm_items.FunctionItem(key, input, presets[key])
            menu.append_item(preset)

    menu.show()


def create_preset(self):
    
    pass



# main()
Macros()
