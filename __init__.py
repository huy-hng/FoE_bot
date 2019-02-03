import sys
import os
import time

def get_github_path():

    orig_path = os.getcwd()

    timer = time.perf_counter()
    while os.getcwd().split('\\')[-1] != 'GitHub':

        os.chdir('..')

        if time.perf_counter() - timer > 2:
            print('Can not find GitHub folder.')
            break

    github_path = os.getcwd()

    os.chdir(orig_path)

    return github_path

github_path = get_github_path()
sys.path.append(github_path)

# print('sys.argv: {0!r}'.format(sys.argv))
# print('sys.path: {0!r}'.format(sys.path))
