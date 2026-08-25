# MediKiosk Full-Stack 1-Click Startup Script (2026)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching MediKiosk Full-Stack Ecosystem..." -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

# 1. Stop any stale processes on Port 5000
Write-Host "1. Clearing stale Node backend processes..." -ForegroundColor Gray
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Launch Python AI Service (Port 8000)
Write-Host "2. Starting Python AI Service on Port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'D:\downloads\medikiosk-ai\medikiosk-ai'; ..\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`""

Start-Sleep -Seconds 2

# 3. Launch Express Backend (Port 5000)
Write-Host "3. Starting Express Backend on Port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'D:\downloads\medikiosk-backend-kaustav-complete'; node single-server.js`""

Start-Sleep -Seconds 2

# 4. Launch React Frontend (Port 5173)
Write-Host "4. Starting React Frontend on Port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'D:\downloads\medikiosk-frontend-2026-redesign-updated'; npm run dev`""

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "✅ All MediKiosk services launched successfully!" -ForegroundColor Green
Write-Host "🌐 Open your browser at: http://localhost:5173" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
