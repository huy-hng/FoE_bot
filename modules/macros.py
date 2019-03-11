import os
import pickle
import time
import winsound
from pprint import PrettyPrinter

import consolemenu as cm
import consolemenu.items as cm_items
import pyautogui
import win32con

import __init__
import win32api
from HuysStudio.python.templates.huys_logging import Logging
from vk_codes import VK_CODE, BINDABLE_keys



class Preset:
    def __init__(self):
        # self.log_preset = Logging('Macros.Preset', level='debug', filter_str='', create_file=True)

        self.macros = {}
        for key in BINDABLE_keys:
            self.macros[key] = None



    def test(self):
        # logger = self.log_preset.get_logger('test')
    
        try:
            pass
        except Exception as e:
            # logger.exception(e)
            pass

    def back(self):
        # logger = self.log_preset.get_logger('back')

        try:
            pass
        except Exception as e:
            # logger.exception(e)
            pass


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



class MainMenu:
    def __init__(self):
        self.log_main_menu = Logging('Macros.Menu', level='debug', filter_str='', create_file=True)

        self.main_menu = cm.ConsoleMenu('Macros', 'Set mouse positions as macros.')
        create_preset_menu = cm_items.FunctionItem('Create new Preset', self.create_new_preset)
        self.main_menu.append_item(create_preset_menu)

        self.load_file()

        self.main_menu.show()


    def create_new_preset(self):
        global presets

        name = input('Preset Name: ')

        preset = Preset()
        presets[name] = preset

        PresetMenu(self.main_menu, name, preset)

    def load_file(self):
        global presets

        logger = self.log_main_menu.get_logger('load_file')

        presets = {}
        if os.path.isfile('data/macros.data'):
            with open('data/macros.data', 'rb') as f:
                presets = pickle.load(f)
                logger.debug(presets)

        if presets:
            for name, preset in presets.items():
                PresetMenu(self.main_menu, name, preset)





class PresetMenu:
    def __init__(self, main_menu, name, preset):
        self.log_preset_menu = Logging('Macros.Menu', level='debug', filter_str='', create_file=True)

        self.main_menu = main_menu
        self.name = name
        self.preset = preset

        create_preset_menu()


    def create_preset_menu(self):

        self.preset_menu = cm.ConsoleMenu(f'{self.name}')

        self.submenu_item = cm_items.SubmenuItem(f'{self.name}', self.preset_menu, self.main_menu)
        self.main_menu.append_item(self.submenu_item)

        macro = cm_items.MenuItem('Create new Macro')
        line = cm_items.MenuItem('─────────────────────')
        change_name = cm_items.FunctionItem('Change Preset Name', lambda: self.change_name(self.name))
        delete = cm_items.FunctionItem('Delete Preset', lambda: self.delete_preset(self.name))

        back = cm_items.FunctionItem('Back', self.preset.back)
        test = cm_items.FunctionItem('Test', self.preset.test)

        self.preset_menu.append_item(macro)
        self.preset_menu.append_item(line)
        self.preset_menu.append_item(change_name)
        self.preset_menu.append_item(delete)

        # preset_menu.append_item(back)
        # preset_menu.append_item(test)
        


    #region preset menu functions
    def delete_preset(self, name):
        global presets
        logger = self.log_preset_menu.get_logger('delete_preset')

        try:
            self.main_menu.remove_item(self.main_menu.current_item)
            self.main_menu.draw()

            del presets[name]

            write_file()

            # self.preset_menu.exit()

        except Exception as e:
            logger.exception(e)


    def change_name(self, name):
        global presets
        logger = self.log_preset_menu.get_logger('change_name')


        try:
            new_name = input('New Name: ')

            # change menu title and main menu name
            self.preset_menu.title = new_name
            self.submenu_item.title = new_name
            
            logger.debug(f'{self.preset_menu}, {type(self.preset_menu)}')
            logger.debug(f'{self.submenu_item}, {type(self.submenu_item)}')
            logger.debug(f'{self.preset_menu.title}, {type(self.preset_menu.title)}')

            self.main_menu.draw()
            self.preset_menu.draw()

            presets[new_name] = presets[name]
            del presets[name]
            logger.debug(presets)

            # self.show_preset_menu()

            write_file()
        except Exception as e:
            logger.exception(e)
    #endregion




presets = {}

def write_file():
    with open('data/macros.data', 'wb') as f:
        pickle.dump(presets, f)

MainMenu()



