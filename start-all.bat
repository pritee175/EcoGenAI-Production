@echo off
echo ========================================
echo   EcoGenAI - Starting Application
echo ========================================
echo.

REM Check if we're in the correct directory
if not exist "backend" (
    echo ERROR: backend folder not found
    echo Please run this script from the EcoGenAI root directory
    pause
    exit /b 1
)

if not exist "frontend-new" (
    echo ERROR: frontend-new folder not found
    echo Please run this script from the EcoGenAI root directory
    pause
    exit /b 1
)

echo Starting Backend Server...
start "EcoGenAI Backend" cmd /k "cd backend && py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak >nul

echo Starting Frontend Server...
start "EcoGenAI Frontend" cmd /k "cd frontend-new && npm run dev"
echo.

echo ========================================
echo   Application Starting...
echo ========================================
echo.
echo Two new command windows have been opened:
echo   1. Backend  - http://localhost:8000
echo   2. Frontend - http://localhost:3000
echo.
echo Wait 10-15 seconds for both servers to start, then:
echo   - Open browser: http://localhost:3000
echo.
echo To stop the servers:
echo   - Press Ctrl+C in each command window
echo.
echo API Documentation:
echo   - http://localhost:8000/docs
echo.
pause
