@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
  py -3 launch.py
) else (
  where python >nul 2>&1
  if errorlevel 1 (
    echo Instala Python 3 desde python.org para iniciar el juego con sus modelos 3D.
  ) else (
    python launch.py
  )
)
pause
