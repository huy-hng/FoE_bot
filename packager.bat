REM create python exe
cd python
pipenv run pyinstaller main.py -y
cd ..

REM go to just created electron folder and create folders
cd electron/release-builds/Forge of Empires Bot-win32-ia32
mkdir temp
mkdir logs
cd ../../..

REM copy templates folder
xcopy /E ".\electron\templates" ".\electron\release-builds\Forge of Empires Bot-win32-ia32\templates\"

REM copy python exe to electron
xcopy /E ".\python\dist\main" ".\electron\release-builds\Forge of Empires Bot-win32-ia32\resources\python\"
