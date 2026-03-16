@echo off
REM ==========================================
REM AI Grading System - Network Setup Script
REM ==========================================
REM This script automatically finds your IP and sets up the environment files

echo.
echo ============================================
echo AI Grading System - Network Configuration
echo ============================================
echo.

REM Find the IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set "IP=%%a"
)

REM Remove leading spaces from IP
for /f "tokens=*" %%a in ("%IP%") do set "IP=%%a"

REM Check if IP was found
if "%IP%"=="" (
    echo ERROR: Could not find IPv4 address
    echo Please run 'ipconfig' manually and find your IPv4 address
    pause
    exit /b 1
)

echo Your IP Address: %IP%
echo.

REM Create Backend .env file
echo Creating Backend .env file...
(
echo PORT=5000
echo NODE_ENV=development
echo FRONTEND_URLS=http://localhost:3000,http://%IP%:3000
echo MONGODB_URI=mongodb://localhost:27017/ai-grading
echo JWT_SECRET=dev_secret_key_change_in_production
) > Backend\.env

echo ✓ Backend .env created

REM Create Frontend .env.local file
echo Creating Frontend .env.local file...
(
echo REACT_APP_API_URL=http://%IP%:5000/api
echo REACT_APP_ENVIRONMENT=development
) > Frontend\.env.local

echo ✓ Frontend .env.local created

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Your Network URLs:
echo   Local:   http://localhost:3000
echo   Network: http://%IP%:3000
echo.
echo Next steps:
echo   1. Open Terminal/PowerShell
echo   2. cd Backend && npm start
echo   3. Open another Terminal/PowerShell
echo   4. cd Frontend && npm start
echo   5. Access at http://%IP%:3000 from other devices
echo.
pause
