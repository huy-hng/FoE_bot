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
from Sandbox.python.templates.huys_logging import Logging
from vk_codes import VK_CODE, BINDABLE_keys



class Preset:
	def __init__(self):
		# self.log_preset = Logging('Macros.Preset', level='debug', filter_str='', create_file=True)

		self.macros = {}
		for key in BINDABLE_keys:
			self.macros[key] = None


	def create_new_macro(self):
		winsound.Beep(440, 200)

		while True:
			x, y = pyautogui.position()
			time.sleep(0.05)

			for k, _ in self.macros.items():
				if self.key_pressed(f'{k}'):
					self.macros[f'{k}'] = [x, y]

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
				self.create_new_macro(self.macros)

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
		self.log_main_menu = Logging('Macros.MainMenu', level='debug', filter_str='',
									 print_=False, create_file=True, time=True)

		self.main_menu = cm.ConsoleMenu('Macros - Main Menu', 'Set mouse positions as macros.')
		create_preset = cm_items.FunctionItem('Create new Preset', self.create_preset)
		self.main_menu.append_item(create_preset)

		self.load_file()

		self.main_menu.show()


		# time.sleep(3)
		# self.main_menu.resume()


	def create_preset(self):
		global presets

		name = input('Preset Name: ')

		preset = Preset()
		presets[name] = preset

		PresetMenu(self.main_menu, name)


	def load_file(self):
		global presets

		logger = self.log_main_menu.get_logger('load_file')

		presets = {}
		if os.path.isfile('data/macros.data'):
			with open('data/macros.data', 'rb') as f:
				presets = pickle.load(f)

		if presets:
			for name in presets:
				logger.debug(f'name: {name}')
				PresetMenu(self.main_menu, name)


class PresetMenu:
	def __init__(self, main_menu, name):
		self.log_preset_menu = Logging('Macros.PresetMenu', level='debug', filter_str='',
										print_=False, create_file=True, time=True)

		self.main_menu = main_menu
		self.name = name

		self.toggle_start_stop = 'start'

		write_file()

		self.create_preset_menu()


	def create_preset_menu(self):

		self.preset_menu = cm.ConsoleMenu(f'Macros - {self.name}')
		self.submenu_item = cm_items.SubmenuItem(f'{self.name}', self.preset_menu, self.main_menu)
		self.main_menu.append_item(self.submenu_item)


		self.start_stop =	cm_items.FunctionItem('Start', self.start_stop)
		self.macro =		cm_items.MenuItem('Create new Macro')
		edit_macros =		cm_items.MenuItem('Edit Macros')
		line =				cm_items.MenuItem('─────────────────────')
		change_name =		cm_items.FunctionItem('Change Preset Name', self.change_name)
		delete =			cm_items.FunctionItem('Delete Preset', self.delete_sub_menus)


		self.preset_menu.append_item(self.start_stop)
		self.preset_menu.append_item(self.macro)
		self.preset_menu.append_item(edit_macros)
		self.preset_menu.append_item(line)
		self.preset_menu.append_item(change_name)
		self.preset_menu.append_item(delete)


	def start_stop(self):
		logger = self.log_preset_menu.get_logger('start_stop')

		try:
			if self.toggle_start_stop == 'start':
				# presets[self.name].start
				self.start_stop.text = 'Stop (END)'
				self.macro.text = 'Create new Macro (F4)'
				self.toggle_start_stop = 'stop'
			else:
				# presets[self.name].stop
				self.start_stop.text = 'Start'
				self.macro.text = 'Create new Macro'
				self.toggle_start_stop = 'start'

		except Exception as e:
			logger.exception(e)


	def macros_menu(self):
		self.macros_menu = cm.ConsoleMenu(f'Macros - {self.name} - Macro list')

		for key, coord in presets[self.name].macros.items():
			if coord is not None:
				self.submenu_item = cm_items.SubmenuItem(f'{self.name}', self.preset_menu, self.main_menu)
				print(f'{key}: {coord[0]}, {coord[1]}')


	#region preset menu functions

	def change_name_menu(self):
		logger = self.log_preset_menu.get_logger('change_name_menu')
		menu = cm.ConsoleMenu('Give it a good name', 
			'Like 420blazeitfaggot or maybe duckmysickUcuckingfunt', show_exit_option=True)
		menu.show()
		menu.pause()
		new_name = menu.get_input()
		logger.debug(f'new_name: {new_name}')


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


	def delete_sub_menus(self):

		delete_very_sad = lambda: self.choice(':(', [':((', ':((('])
		delete_ok_sorry = lambda: self.choice('Too late bitch', [':(', ':(('])

		delete_after_menu = lambda: self.choice('Bitch y u press in the first place then', 
												["Ok sorry, you're right. Delete!", '¯\_(ツ)_/¯'],
												[delete_ok_sorry, delete_very_sad])

		delete_prompt = lambda: self.choice('Delete?', ['Yes!', 'Wait nO'], 
											[self.delete_preset, delete_after_menu])

		delete_prompt()


	def choice(self, title, text, function=None):

		logger = self.log_preset_menu.get_logger(f'choice: {title}')

		try:
			menu = cm.ConsoleMenu(f'{title}', show_exit_option=False)

			for i, text in enumerate(text):
				choice = cm_items.MenuItem(f'{text}', should_exit=True)
				if function is not None:
					if function[i] is not None:
						choice = cm_items.FunctionItem(f'{text}', function[i], should_exit=True)

				menu.append_item(choice)


			menu.show()
			
		except Exception as e:
			logger.exception(e)


	def delete_preset(self):
		global presets
		logger = self.log_preset_menu.get_logger('delete_preset')

		try:
			self.main_menu.remove_item(self.submenu_item)
			self.main_menu.draw()

			del presets[self.name]


			self.preset_menu.current_option = len(self.preset_menu.items) - 1
			self.preset_menu.select()
			self.main_menu.show()

			write_file()

		except Exception as e:
			logger.exception(e)

	#endregion




presets = {}

def write_file():
	with open('data/macros.data', 'wb') as f:
		pickle.dump(presets, f)

MainMenu()



