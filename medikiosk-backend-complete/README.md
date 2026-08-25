# MediKiosk Backend MVP

MVP backend for SIH PS 47: patient clinical intake, doctor verification, consent, document upload, AI summary, and ABDM-ready mock adapters.

## 1. Prerequisites
- Node.js 20+
- PostgreSQL 15+

## 2. Setup
```bash
npm install
cp .env.example .env
```

Create the database:
```sql
CREATE DATABASE medikiosk;
```

Then run:
```bash
psql -d medikiosk -f sql/schema.sql
npm run dev
```

## 3. Health check
Open:
http://localhost:5000/health

## 4. Main APIs
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/patients/me`
- PUT `/api/patients/me`
- POST `/api/cases`
- PUT `/api/cases/:id`
- GET `/api/cases/my`
- GET `/api/cases/doctor`
- GET `/api/cases/:id`
- POST `/api/cases/:id/generate-summary`
- POST `/api/cases/:id/assign`
- POST `/api/cases/:id/confirm`
- POST `/api/abdm/abha/verify` (mock)
- POST `/api/doctors/verify-hpr` (mock)
- POST `/api/consents`
- GET `/api/consents`
- POST `/api/consents/:id/revoke`
- POST `/api/documents/upload`
- GET `/api/documents`

## Demo assumptions
ABDM is not directly connected yet. The `abdm.mock.service.js` adapter intentionally simulates ABHA/HPR verification so the rest of the product can be built and demonstrated. Replace this adapter with official ABDM sandbox calls once credentials are provisioned.
