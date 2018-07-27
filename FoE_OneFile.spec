# -*- mode: python -*-

block_cipher = None

data_files = [
    ('img', 'img'),
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
          a.binaries,
          a.zipfiles,
          a.datas,
          name='foe',
          debug=False,
          strip=False,
          upx=True,
          runtime_tmpdir=None,
          console=True )
