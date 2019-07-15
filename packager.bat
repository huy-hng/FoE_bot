cd python
pipenv run pyinstaller main.py -y
cd ../electron
npm run package-win
cd release-builds/Forge of Empires Bot-win32-ia32
mkdir temp
mkdir logs
cd resources
mkdir python