import time
import win32api, win32con

from vk_codes import VK_CODE



def key_pressed(key):
    return win32api.GetAsyncKeyState(VK_CODE[key])

while True:
    for key, _ in VK_CODE.items():
        if key_pressed(key):
            print(key)


    time.sleep(0.01)