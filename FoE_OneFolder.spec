# -*- mode: python -*-

block_cipher = None

data_files = [
    ('img/close.png', 'img'),
    ('img/first.png', 'img'),
    ('img/friends_tab.png', 'img'),
    ('img/guild_tab.png', 'img'),
    ('img/help.png', 'img'),
    ('img/last.png', 'img'),
    ('img/neighbors_tab.png', 'img'),
    ('img/next.png', 'img'),
    ('img/previous.png', 'img'),
    ('img/tavern.png', 'img'),
    ('img/up_start.png', 'img'),
]

a = Analysis(['foe.py'],
             pathex=['C:\\projects\\FoE'],
             binaries=[],
             datas=data_files,
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='foe',
          debug=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='foe')
