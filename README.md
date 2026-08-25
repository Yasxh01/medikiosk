# MediKiosk 2026: Autonomous Clinical Pre-Intake & ABHA Integration Platform

> **Ayushman Bharat Digital Mission (ABDM) • Digital Personal Data Protection (DPDP) Act 2023 Compliant**  
> **Clinical Decision Support System powered by Google Gemini 3.6 Flash & PostgreSQL 18**

---

## 🏗️ Architecture Overview

The MediKiosk monorepo is structured into 3 microservices:

```text
medikiosk-production-github-repo/
├── frontend/             # React (Vite) + Tailwind CSS Cyber-Government UI
├── backend/              # Node.js Express API Gateway & PostgreSQL Migrations
├── ai-service/           # FastAPI Python Microservice (Google Gemini 3.6 Flash)
├── start-medikiosk.ps1   # 1-Click Master Startup Script
└── .gitignore            # Security & Dependency Exclusion Directives
```

---

## ⚡ Quick Start (Local Development)

### 1-Click Master Launcher (Windows PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File "start-medikiosk.ps1"
```

---

## 🚀 Running Microservices Independently

### 1. Database Initializer (PostgreSQL)
```bash
cd backend
npm run db:setup
```

### 2. Python AI Microservice (FastAPI + Gemini)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Express Node Backend (Port 5000)
```bash
cd backend
npm run dev
```

### 4. React Vite Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

---

## 📊 Endpoints & Verification Summary

- 🌐 **Patient Kiosk & Doctor Portal:** `http://localhost:5173`
- ⚙️ **Express REST API:** `http://localhost:5000/api/cases/doctor`
- 🤖 **FastAPI AI Docs:** `http://127.0.0.1:8000/docs`
