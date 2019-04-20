import concurrent.futures
import os
import pickle
import time
import winsound
from concurrent.futures.thread import ThreadPoolExecutor

import consolemenu as cm
import consolemenu.items as cm_items
import pyautogui
import win32con

import __init__
import win32api
from Sandbox.python.templates.huys_logging import Logging
from vk_codes import VK_CODE, BINDABLE_keys

def submenu_creator(title: str, text_function: dict):

    logger = log_root.get_logger(f'choice: {title}')

    try:
        menu = cm.ConsoleMenu(f'{title}', show_exit_option=False)

        for text, function in text_function.items():
            if function is not None:
                choice = cm_items.FunctionItem(f'{text}', function, should_exit=True)
            else:
                choice = cm_items.MenuItem(f'{text}', should_exit=True)

            menu.append_item(choice)


        menu.show()
        
    except Exception as e:
        logger.exception(e)

class MainMenu:
    def __init__(self, presets: dict):
        self.log_main_menu = Logging('Macros.MainMenu', level='debug', filter_str='',
                                     print_=False, create_file=True, time=True)

        self.presets = presets

        self.main_menu = cm.ConsoleMenu('Macros - Main Menu', 'Set mouse positions as macros.')
        create_preset = cm_items.FunctionItem('Create new Preset', self.create_preset)
        self.main_menu.append_item(create_preset)

        self.main_menu.show()


    def create_preset(self):

        name = input('Preset Name: ')

        PresetMenu(self.main_menu, name, self.presets)


class PresetMenu:
    def __init__(self, main_menu, name, presets):
        self.log_preset_menu = Logging('Macros.PresetMenu', level='debug', filter_str='',
                                       print_=False, create_file=True, time=True)

        self.main_menu = main_menu
        self.name = name
        self.presets = presets

        self.toggle_start_stop = 'start'


        self.preset_menu = cm.ConsoleMenu(f'Macros - {self.name}')
        self.submenu_item = cm_items.SubmenuItem(f'{self.name}', self.preset_menu, self.main_menu)
        self.main_menu.append_item(self.submenu_item)

        self.start_stop	= cm_items.FunctionItem('Start'             , self.start_stop            )
        create_macro	= cm_items.FunctionItem('Create new Macro'  , self.submenu_macro		 )
        line			= cm_items.MenuItem    ('─────────────────────'                    )
        change_name		= cm_items.FunctionItem('Change Preset Name', self.change_name           )
        delete          = cm_items.FunctionItem('Delete Preset'     , self.submenus_delete_preset)

        self.preset_menu.append_item(self.start_stop)
        self.preset_menu.append_item(create_macro)
        self.preset_menu.append_item(line)
        self.preset_menu.append_item(line)
        self.preset_menu.append_item(change_name)
        self.preset_menu.append_item(delete)

        # add macros
        for key, coord in self.macros.items():
            if coord is not None:
                self.submenu_macro(key)


    def change_name(self):
        global presets
        logger = self.log_preset_menu.get_logger('change_name')

        try:
            new_name = input('New Name: ')

            # change menu title and main menu name
            self.preset_menu.title = new_name
            self.submenu_item.text = new_name

            self.main_menu.draw()
            self.preset_menu.draw()

            presets[new_name] = presets[self.name]
            del presets[self.name]
            self.name = new_name
            logger.debug(presets)

            # self.show_preset_menu()

            write_file()
        except Exception as e:
            logger.exception(e)

    def submenus_delete_preset(self):

        def delete_preset(self):
            self.presets
            logger = self.log_preset_menu.get_logger('delete_preset')

            try:
                self.main_menu.remove_item(self.submenu_item)
                self.main_menu.draw()

                del self.presets[self.name]

                self.preset_menu.current_option = len(self.preset_menu.items) - 1
                self.preset_menu.select()
                self.main_menu.show()

            except Exception as e:
                logger.exception(e)
                
        delete_very_sad = lambda: submenu_creator(':(', {':((': None, ':(((': None})
        delete_ok_sorry = lambda: submenu_creator('Too late bitch', {':(': None, ':((': None})

        delete_after_menu = lambda: submenu_creator(
            'Bitch y u press in the first place then', 
            {"Ok sorry, you're right. Delete!": delete_ok_sorry, '¯\_(ツ)_/¯': delete_very_sad})

        delete_prompt = lambda: submenu_creator(
            'Delete?', {'Yes!': delete_preset, 'Wait nO': delete_after_menu})

        delete_prompt()




class MacroMenu:
    def __init__(self):
        self.log_macro_menu = Logging('Macros.MacroMenu', level='debug', filter_str='',
                                        print_=False, create_file=True, time=True)


    def delete_macro(self, menu, submenu):

        logger = self.log_macro_menu.get_logger('delete_macro')

        try:
            self.preset_menu.remove_item(submenu)
            self.preset_menu.draw()
            self.main_menu.draw()
            menu.current_option = len(menu.items) - 1
            menu.select()
            self.preset_menu.show()

            write_file()
        except Exception as e:
            logger.exception(e)




def write_file(presets):
    with open('data/macros.data', 'wb') as f:
        pickle.dump(presets, f)

def load_file():

    logger = log_root.get_logger('load_file')

    presets = {}
    if os.path.isfile('data/macros.data'):
        with open('data/macros.data', 'rb') as f:
            presets = pickle.load(f)
            logger.debug(f'presets: {presets}')

    return presets




if __name__ == '__main__':
    log_root = Logging('root', level='debug', filter_str='', print_=False, create_file=True, time=True)
    os.chdir('./FoE_bot')
    # print(os.getcwd())
    executor = concurrent.futures.ThreadPoolExecutor()
    MainMenu()
