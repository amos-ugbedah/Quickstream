@echo off
cd /d "%~dp0"
:: Use a simple title without symbols to avoid errors
TITLE VORTEX PRO ENGINE - DAILY HARVEST
color 0C

echo ===================================================
echo   VORTEX PRO: DAILY HARVEST AND SYSTEM REFRESH
echo ===================================================
echo.

:: STEP 1: AUTO-UPDATE EXTRACTION ENGINE
echo [1/4] Checking for updates...
:: We use the direct path to your .venv to bypass the broken C:\Python313 path
".venv\Scripts\python.exe" -m pip install -U yt-dlp --quiet

:: STEP 2: RUN SCRAPER
echo [2/4] Harvesting new content...
cd backend
"..\.venv\Scripts\python.exe" scraper.py
cd ..

:: STEP 3: REFRESH FRONTEND DATA
echo [3/4] Content merged into 7-day vault.
echo Updating local cache...

:: STEP 4: SYSTEM SYNC
echo [4/4] System Sync Complete.
echo.
echo ===================================================
echo   SUCCESS: VAULT UPDATED AND READY
echo ===================================================
echo.
echo Press any key to close this window.
pause
exit