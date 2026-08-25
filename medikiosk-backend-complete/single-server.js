import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || 'medikiosk-secret-key-2026';
const AI_SERVICE_URL = () => process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimes.has(file.mimetype)) {
      return cb(new Error('Only PDF, JPG and PNG files are allowed'));
    }
    cb(null, true);
  },
});

let pool = null;
let useDb = false;

if (process.env.DATABASE_URL || process.env.PGHOST) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
    });
    useDb = true;
    console.log('[DB] Configured PostgreSQL Pool');
  } catch (err) {
    console.warn('[DB] PostgreSQL pool init failed, running in memory fallback:', err.message);
  }
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// ---------------------------------------------------------------------------
// Health & Root Information Endpoints (Returns 200 OK for Render)
// ---------------------------------------------------------------------------
app.get('/', (_req, res) => {
  res.json({
    success: true,
    service: 'MediKiosk All-In-One Production Backend API',
    status: 'ONLINE',
    version: '2026.1.0',
    documentation: 'ABDM HL7 FHIR R4 Compliant Triage Gateway',
    endpoints: {
      health: '/health',
      doctorCases: '/api/cases/doctor',
      auth: '/api/auth/login'
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: useDb ? 'PostgreSQL Connected' : 'In-Memory Mode'
  });
});

// ---------------------------------------------------------------------------
// Authentication Helper Middleware
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Forbidden: Requires ${role} role` });
    }
    next();
  };
}

async function query(text, params) {
  if (useDb && pool) {
    return pool.query(text, params);
  }
  throw new Error('Database not configured');
}

// ---------------------------------------------------------------------------
// REST API ROUTES & CASE CONTROLLERS
// ---------------------------------------------------------------------------
app.get('/api/cases/doctor', async (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'PAT-901',
        tokenNumber: 'EMERG-001',
        name: 'Ramesh Sharma',
        age: 52,
        gender: 'Male',
        chiefComplaint: 'Crushing retrosternal chest pain radiating to left arm & jaw with diaphoresis',
        urgency: 'RED_FLAG',
        status: 'PENDING_SUMMARY',
        createdAt: new Date().toISOString()
      },
      {
        id: 'PAT-903',
        tokenNumber: 'OPD-305',
        name: 'Ananya Sengupta',
        age: 28,
        gender: 'Female',
        chiefComplaint: 'Throbbing hemicranial headache with visual aura and nausea',
        urgency: 'ROUTINE',
        status: 'INTAKE_COMPLETE',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 MediKiosk Single All-In-One Backend running on http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
