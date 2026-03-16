@echo off
REM ==========================================
REM Start All Services Script
REM ==========================================
REM This script starts both Backend and Frontend in separate windows

echo.
echo ============================================
echo Starting AI Grading System
echo ============================================
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set "IP=%%a"
)

for /f "tokens=*" %%a in ("%IP%") do set "IP=%%a"

if "%IP%"=="" (
    set "IP=localhost"
)

echo Your Network Address: http://%IP%:3000
echo Local Address: http://localhost:3000
echo.

REM Start Backend
echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && npm start"

timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend Server...
start "Frontend Development" cmd /k "cd Frontend && npm start"

echo.
echo ============================================
echo Services Started!
echo ============================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000 or http://%IP%:3000
echo.
echo Wait for both to fully load (15-30 seconds)
echo A browser window should open automatically
echo.
pause
