@echo off
chcp 65001 > nul

REM このスクリプトのあるディレクトリに移動
cd /d "%~dp0"

echo ========================================
echo   PDF to PPTX Converter - Server Start
echo ========================================
echo.

REM Gemini API Key設定
set GEMINI_API_KEY=AIzaSyCvXVh40wANNGkDpXCbx2kvyRJuw5KI5B8

echo [INFO] Current directory: %cd%
echo [INFO] Starting server...
echo [INFO] Access URL: http://localhost:8000/static/index.html
echo.

python -m uvicorn server:app --reload --port 8000 --host 0.0.0.0

pause
