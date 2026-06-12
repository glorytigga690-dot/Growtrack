@echo off
echo 🌱 Starting GrowTrack Locally...
cd /d "%~dp0server"

if not exist node_modules (
    echo 📦 Installing server dependencies...
    call npm install
)

echo 🚀 Starting development server...
call npm run dev
pause
