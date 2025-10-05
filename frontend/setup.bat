@echo off
echo ClimoPilot Setup Script
echo ======================

echo.
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies. Please check your internet connection.
    pause
    exit /b 1
)

echo.
echo Setup complete! 
echo.
echo To start the application, run: npm start
echo.
pause
