@echo off
echo ========================================
echo   Oftisoft Frontend - Quick Start
echo ========================================
echo.

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting development server...
echo.
echo ========================================
echo   Frontend running at: http://localhost:3000
echo   Login: http://localhost:3000/dashboard/login
echo   Register: http://localhost:3000/dashboard/register
echo ========================================
echo.

call npm run dev
