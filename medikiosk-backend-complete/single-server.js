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

// Upload directory setup
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
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

// Database pool setup (PostgreSQL with in-memory fallback)
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
    });
    useDb = true;
    console.log('[DB] Configured PostgreSQL Pool');
  } catch (err) {
    console.warn('[DB] PostgreSQL initialization failed, using in-memory store:', err.message);
  }
}

// In-Memory Store for fallback zero-downtime demo mode
const memStore = {
  users: [],
  patients: [],
  doctors: [],
  cases: [],
  documents: [],
  consents: [],
  abdmLinks: [],
  aiSummaries: [],
  auditLogs: [],
};

async function query(sql, params = []) {
  if (useDb && pool) {
    try {
      return await pool.query(sql, params);
    } catch (err) {
      console.warn('[DB Query Error] Falling back to memory store:', err.message);
    }
  }
  return executeMemQuery(sql, params);
}

// Memory Query Handler
function executeMemQuery(sql, params) {
  const normalized = sql.trim().toLowerCase();
  
  if (normalized.startsWith('select * from users where email =')) {
    const user = memStore.users.find(u => u.email === params[0] || u.phone === params[0]);
    return { rows: user ? [user] : [] };
  }
  if (normalized.startsWith('select * from users where phone =')) {
    const user = memStore.users.find(u => u.phone === params[0]);
    return { rows: user ? [user] : [] };
  }
  if (normalized.startsWith('select * from users where id =')) {
    const user = memStore.users.find(u => u.id === params[0]);
    return { rows: user ? [user] : [] };
  }
  if (normalized.startsWith('insert into users')) {
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: params[0],
      email: params[1],
      phone: params[2],
      password_hash: params[3],
      role: params[4],
      created_at: new Date().toISOString(),
    };
    memStore.users.push(newUser);
    return { rows: [newUser] };
  }
  if (normalized.startsWith('insert into patients')) {
    const newPat = {
      id: `pat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id: params[0],
      abha_number: params[1] || null,
      abha_address: params[2] || null,
      created_at: new Date().toISOString(),
    };
    memStore.patients.push(newPat);
    return { rows: [newPat] };
  }
  if (normalized.startsWith('insert into doctors')) {
    const newDoc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id: params[0],
      hpr_id: params[1] || null,
      verification_status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    memStore.doctors.push(newDoc);
    return { rows: [newDoc] };
  }
  if (normalized.startsWith('select id from patients where user_id =')) {
    const pat = memStore.patients.find(p => p.user_id === params[0]);
    return { rows: pat ? [{ id: pat.id }] : [] };
  }
  if (normalized.startsWith('select id from doctors where user_id =')) {
    const doc = memStore.doctors.find(d => d.user_id === params[0]);
    return { rows: doc ? [{ id: doc.id }] : [] };
  }
  if (normalized.startsWith('select p.*, u.name as patient_name')) {
    const pat = memStore.patients.find(p => p.user_id === params[0] || p.id === params[0]);
    if (!pat) return { rows: [] };
    const user = memStore.users.find(u => u.id === pat.user_id) || {};
    return { rows: [{ ...pat, patient_name: user.name, email: user.email, phone: user.phone }] };
  }
  if (normalized.startsWith('select d.*, u.name')) {
    const doc = memStore.doctors.find(d => d.user_id === params[0] || d.id === params[0]);
    if (!doc) return { rows: [] };
    const user = memStore.users.find(u => u.id === doc.user_id) || {};
    return { rows: [{ ...doc, name: user.name, email: user.email, phone: user.phone }] };
  }
  if (normalized.startsWith('insert into cases')) {
    const newCase = {
      id: `case_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      patient_id: params[0],
      chief_complaint: params[1],
      history_of_present_illness: params[2],
      past_medical_history: params[3],
      past_surgical_history: params[4],
      drug_history: params[5],
      allergy_history: params[6],
      family_history: params[7],
      personal_history: params[8],
      review_of_systems: params[9],
      ayush_history: params[10],
      vitals: params[11],
      patient_language: params[12],
      source: params[13] || 'WEB',
      status: params[14] || 'DRAFT',
      red_flags: [],
      created_at: new Date().toISOString(),
    };
    memStore.cases.push(newCase);
    return { rows: [newCase] };
  }
  if (normalized.includes('update cases set') && (normalized.includes('chief_complaint') || normalized.includes('history_of_present_illness'))) {
    const item = memStore.cases.find(c => c.id === params[14] && c.patient_id === params[15]);
    if (item) {
      if (params[0] !== null) item.chief_complaint = params[0];
      if (params[1] !== null) item.history_of_present_illness = params[1];
      if (params[2] !== null) item.past_medical_history = params[2];
      if (params[3] !== null) item.past_surgical_history = params[3];
      if (params[4] !== null) item.drug_history = params[4];
      if (params[5] !== null) item.allergy_history = params[5];
      if (params[6] !== null) item.family_history = params[6];
      if (params[7] !== null) item.personal_history = params[7];
      if (params[8] !== null) item.review_of_systems = JSON.parse(params[8]);
      if (params[9] !== null) item.ayush_history = JSON.parse(params[9]);
      if (params[10] !== null) item.vitals = JSON.parse(params[10]);
      if (params[11] !== null) item.patient_language = params[11];
      if (params[12] !== null) item.source = params[12];
      if (params[13] !== null) item.status = params[13];
      item.updated_at = new Date().toISOString();
    }
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('select * from cases where patient_id =')) {
    const list = memStore.cases.filter(c => c.patient_id === params[0]);
    return { rows: list };
  }
  if (normalized.startsWith('select * from cases where id =')) {
    const item = memStore.cases.find(c => c.id === params[0]);
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('select c.*, u.name as patient_name')) {
    const list = memStore.cases.map(c => {
      const pat = memStore.patients.find(p => p.id === c.patient_id);
      const user = pat ? memStore.users.find(u => u.id === pat.user_id) : {};
      return { ...c, patient_name: user?.name || 'Patient', abha_number: pat?.abha_number, abha_address: pat?.abha_address };
    });
    if (params[0]) {
      const match = list.find(c => c.id === params[0]);
      return { rows: match ? [match] : [] };
    }
    return { rows: list };
  }
  if (normalized.startsWith('insert into documents')) {
    const newDoc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      patient_id: params[0],
      case_id: params[1],
      original_name: params[2],
      stored_name: params[3],
      mime_type: params[4],
      file_path: params[5],
      document_type: params[6],
      ocr_text: null,
      extracted_data: {},
      created_at: new Date().toISOString(),
    };
    memStore.documents.push(newDoc);
    return { rows: [newDoc] };
  }
  if (normalized.startsWith('select * from documents where patient_id =')) {
    const list = memStore.documents.filter(d => d.patient_id === params[0]);
    return { rows: list };
  }
  if (normalized.startsWith('select * from documents where id =')) {
    const item = memStore.documents.find(d => d.id === params[0]);
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('update documents set ocr_text =')) {
    const item = memStore.documents.find(d => d.id === params[2]);
    if (item) {
      item.ocr_text = params[0];
      item.extracted_data = JSON.parse(params[1] || '{}');
    }
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('insert into consents')) {
    const newCons = {
      id: `cons_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      patient_id: params[0],
      purpose: params[1],
      consent_text: params[2],
      status: 'GRANTED',
      granted_at: new Date().toISOString(),
    };
    memStore.consents.push(newCons);
    return { rows: [newCons] };
  }
  if (normalized.startsWith('select * from consents where patient_id =')) {
    const list = memStore.consents.filter(c => c.patient_id === params[0]);
    return { rows: list };
  }
  if (normalized.startsWith('update consents set status =')) {
    const item = memStore.consents.find(c => c.id === params[0] && c.patient_id === params[1]);
    if (item) {
      item.status = 'REVOKED';
      item.revoked_at = new Date().toISOString();
    }
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('insert into ai_summaries')) {
    const newAi = {
      id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      case_id: params[0],
      summary: params[1],
      structured_data: JSON.parse(params[2] || '{}'),
      red_flags: JSON.parse(params[3] || '[]'),
      model_name: params[4],
      doctor_approved: false,
      created_at: new Date().toISOString(),
    };
    memStore.aiSummaries.push(newAi);
    return { rows: [newAi] };
  }
  if (normalized.startsWith('update cases set red_flags =')) {
    const item = memStore.cases.find(c => c.id === params[1]);
    if (item) {
      item.red_flags = JSON.parse(params[0] || '[]');
    }
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('update cases set doctor_id =')) {
    const item = memStore.cases.find(c => c.id === params[1]);
    if (item) {
      item.doctor_id = params[0];
      item.status = 'IN_REVIEW';
    }
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('update cases set status = \'confirmed\'')) {
    const item = memStore.cases.find(c => c.id === params[1]);
    if (item) {
      item.status = 'CONFIRMED';
      item.doctor_notes = params[0];
    }
    return { rows: item ? [item] : [] };
  }
  if (normalized.startsWith('update patients set abha_number =')) {
    const item = memStore.patients.find(p => p.id === params[2]);
    if (item) {
      item.abha_number = params[0];
      item.abha_address = params[1];
    }
    return { rows: item ? [item] : [] };
  }

  return { rows: [] };
}

// ---------------------------------------------------------------------------
// Auth Middleware & Helpers
// ---------------------------------------------------------------------------
function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
  }
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
}

// ---------------------------------------------------------------------------
// AI Service Integration Bridge (FastAPI / Fallback)
// ---------------------------------------------------------------------------
function toStructuredHistory(payload = {}) {
  return {
    chief_complaint: payload.chiefComplaint || '',
    hpi: {
      onset: '', duration: '', character: '', location: '', radiation: '',
      aggravating_factors: '', relieving_factors: '', severity: '',
      associated_symptoms: [], progression: payload.historyOfPresentIllness || '',
    },
    past_medical_history: payload.pastMedicalHistory ? [payload.pastMedicalHistory] : [],
    past_surgical_history: payload.pastSurgicalHistory ? [payload.pastSurgicalHistory] : [],
    medications: payload.drugHistory ? [payload.drugHistory] : [],
    allergies: payload.allergyHistory ? [payload.allergyHistory] : [],
    family_history: payload.familyHistory ? [payload.familyHistory] : [],
    personal_history: payload.personalHistory ? [payload.personalHistory] : [],
    review_of_systems: [],
  };
}

async function generateHistorySummary(payload) {
  try {
    const structuredHistory = toStructuredHistory(payload);
    const [summaryRes, redFlagsRes] = await Promise.all([
      axios.post(`${AI_SERVICE_URL()}/generate-summary`, { history: structuredHistory, documents: [], patient: {} }, { timeout: 15_000 }),
      axios.post(`${AI_SERVICE_URL()}/red-flags`, { text: payload.chiefComplaint || '', history: structuredHistory }, { timeout: 15_000 }),
    ]);

    const rawFlags = redFlagsRes.data.red_flags || [];
    const redFlags = rawFlags.map(rf => ({
      level: String(rf.severity || '').toUpperCase() === 'HIGH' ? 'HIGH' : 'MODERATE',
      message: rf.flag || rf.label || rf.reason || 'Red flag symptom detected',
    }));

    return {
      summary: summaryRes.data.summary_text,
      structuredData: structuredHistory,
      redFlags,
      modelName: 'aditee-ai-service',
    };
  } catch (err) {
    console.warn('[AI Bridge] Service offline or unreachable; using robust fallback:', err.message);
    return mockAiSummary(payload);
  }
}

async function extractDocument(filePath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const { data } = await axios.post(`${AI_SERVICE_URL()}/extract-document`, form, {
      headers: form.getHeaders(),
      timeout: 30_000,
    });

    return {
      ocrText: data.extraction.raw_text,
      extractedData: data.extraction,
    };
  } catch (err) {
    console.warn('[AI Extraction] Service unreachable; using mock extraction:', err.message);
    return {
      ocrText: 'Patient advised Paracetamol 500mg twice daily for 3 days.',
      extractedData: {
        document_type: 'prescription',
        medications: [{ name: 'Paracetamol', dose: '500mg', frequency: 'twice daily', duration: '3 days' }],
      },
    };
  }
}

function mockAiSummary(payload) {
  const redFlags = [];
  const text = `${payload.chiefComplaint || ''} ${payload.historyOfPresentIllness || ''}`.toLowerCase();

  if (/(chest pain|difficulty breathing|breathlessness|fainting|stroke|severe bleeding)/i.test(text)) {
    redFlags.push({
      level: 'HIGH',
      message: 'Potential emergency symptoms detected. Priority clinical review recommended.',
    });
  }

  const summary = [
    `Chief Complaint: ${payload.chiefComplaint || 'Not provided'}`,
    `History of Present Illness: ${payload.historyOfPresentIllness || 'Not provided'}`,
    `Past Medical History: ${payload.pastMedicalHistory || 'Not provided'}`,
    `Past Surgical History: ${payload.pastSurgicalHistory || 'Not provided'}`,
    `Drug History: ${payload.drugHistory || 'Not provided'}`,
    `Allergy History: ${payload.allergyHistory || 'Not provided'}`,
    `Family History: ${payload.familyHistory || 'Not provided'}`,
    `Personal History: ${payload.personalHistory || 'Not provided'}`,
  ].join('\n\n');

  return {
    summary,
    structuredData: payload,
    redFlags,
    modelName: 'mock-clinical-summarizer-v1',
  };
}

// ---------------------------------------------------------------------------
// Express Middleware Setup
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, service: 'medikiosk-single-backend', time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// 1. AUTH ROUTES
// ---------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || (!email && !phone) || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email/phone, password and role are required' });
    }

    const check = await query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email || '', phone || '']);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const userRes = await query('INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING *', [name, email || null, phone || null, hash, role]);
    const user = userRes.rows[0];

    if (role === 'PATIENT') {
      await query('INSERT INTO patients (user_id) VALUES ($1)', [user.id]);
    } else if (role === 'DOCTOR') {
      await query('INSERT INTO doctors (user_id) VALUES ($1)', [user.id]);
    }

    const token = signToken(user);
    res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = email || phone;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/phone and password are required' });
    }

    const userRes = await query('SELECT * FROM users WHERE email = $1 OR phone = $1', [identifier]);
    const user = userRes.rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, data: req.user });
});

// ---------------------------------------------------------------------------
// 2. PATIENT ROUTES
// ---------------------------------------------------------------------------
app.get('/api/patients/me', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const pat = await query('SELECT p.*, u.name AS patient_name, u.email, u.phone FROM patients p JOIN users u ON u.id = p.user_id WHERE p.user_id = $1', [req.user.id]);
    res.json({ success: true, data: pat.rows[0] || null });
  } catch (err) { next(err); }
});

app.put('/api/patients/me', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const { abhaNumber, abhaAddress } = req.body;
    const pat = await query('SELECT id FROM patients WHERE user_id = $1', [req.user.id]);
    const patientId = pat.rows[0]?.id;
    if (!patientId) return res.status(404).json({ success: false, message: 'Patient profile not found' });

    const updated = await query('UPDATE patients SET abha_number = $1, abha_address = $2 WHERE id = $3 RETURNING *', [abhaNumber, abhaAddress, patientId]);
    res.json({ success: true, data: updated.rows[0] });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// 3. DOCTOR ROUTES
// ---------------------------------------------------------------------------
app.get('/api/doctors/me', requireAuth, requireRole('DOCTOR'), async (req, res, next) => {
  try {
    const doc = await query('SELECT d.*, u.name, u.email, u.phone FROM doctors d JOIN users u ON u.id = d.user_id WHERE d.user_id = $1', [req.user.id]);
    res.json({ success: true, data: doc.rows[0] || null });
  } catch (err) { next(err); }
});

app.post('/api/doctors/verify-hpr', requireAuth, requireRole('DOCTOR'), async (req, res, next) => {
  try {
    const { hprId } = req.body;
    if (!hprId) return res.status(400).json({ success: false, message: 'HPR ID is required' });

    const verification = {
      verified: true,
      source: 'MOCK_ABDM_HPR',
      professional: { hprId, name: 'Dr. Demo Sharma', specialization: 'General Medicine', status: 'ACTIVE' },
    };
    res.json({ success: true, data: verification });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// 4. CASE ROUTES
// ---------------------------------------------------------------------------
async function getPatientId(userId) {
  const result = await query('SELECT id FROM patients WHERE user_id = $1', [userId]);
  return result.rows[0]?.id;
}

app.post('/api/cases', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = await getPatientId(req.user.id);
    if (!patientId) return res.status(404).json({ success: false, message: 'Patient profile not found' });

    const b = req.body;
    const result = await query(
      `INSERT INTO cases (patient_id, chief_complaint, history_of_present_illness, past_medical_history, past_surgical_history, drug_history, allergy_history, family_history, personal_history, review_of_systems, ayush_history, vitals, patient_language, source, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15) RETURNING *`,
      [patientId, b.chiefComplaint, b.historyOfPresentIllness, b.pastMedicalHistory, b.pastSurgicalHistory, b.drugHistory, b.allergyHistory, b.familyHistory, b.personalHistory, JSON.stringify(b.reviewOfSystems || {}), JSON.stringify(b.ayushHistory || {}), JSON.stringify(b.vitals || {}), b.patientLanguage || 'en', b.source || 'WEB', b.status || 'DRAFT']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

app.put('/api/cases/:id', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const b = req.body;
    const patientId = await getPatientId(req.user.id);
    const result = await query(
      `UPDATE cases SET
        chief_complaint = COALESCE($1, chief_complaint),
        history_of_present_illness = COALESCE($2, history_of_present_illness),
        past_medical_history = COALESCE($3, past_medical_history),
        past_surgical_history = COALESCE($4, past_surgical_history),
        drug_history = COALESCE($5, drug_history),
        allergy_history = COALESCE($6, allergy_history),
        family_history = COALESCE($7, family_history),
        personal_history = COALESCE($8, personal_history),
        review_of_systems = CASE WHEN $9 IS NULL THEN review_of_systems ELSE $9::jsonb END,
        ayush_history = CASE WHEN $10 IS NULL THEN ayush_history ELSE $10::jsonb END,
        vitals = CASE WHEN $11 IS NULL THEN vitals ELSE $11::jsonb END,
        patient_language = COALESCE($12, patient_language),
        source = COALESCE($13, source),
        status = COALESCE($14, status),
        updated_at = NOW()
       WHERE id = $15 AND patient_id = $16
       RETURNING *`,
      [
        b.chiefComplaint ?? null,
        b.historyOfPresentIllness ?? null,
        b.pastMedicalHistory ?? null,
        b.pastSurgicalHistory ?? null,
        b.drugHistory ?? null,
        b.allergyHistory ?? null,
        b.familyHistory ?? null,
        b.personalHistory ?? null,
        b.reviewOfSystems ? JSON.stringify(b.reviewOfSystems) : null,
        b.ayushHistory ? JSON.stringify(b.ayushHistory) : null,
        b.vitals ? JSON.stringify(b.vitals) : null,
        b.patientLanguage ?? null,
        b.source ?? null,
        b.status ?? null,
        req.params.id,
        patientId,
      ]
    );

    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

app.get('/api/cases/my', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = await getPatientId(req.user.id);
    const result = await query('SELECT * FROM cases WHERE patient_id = $1 ORDER BY created_at DESC', [patientId]);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
});

app.get('/api/cases/doctor', requireAuth, requireRole('DOCTOR'), async (req, res, next) => {
  try {
    const result = await query('SELECT c.*, u.name AS patient_name, p.abha_number, p.abha_address FROM cases c JOIN patients p ON p.id = c.patient_id JOIN users u ON u.id = p.user_id ORDER BY c.created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
});

app.get('/api/cases/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query('SELECT c.*, u.name AS patient_name, p.abha_number, p.abha_address FROM cases c JOIN patients p ON p.id = c.patient_id JOIN users u ON u.id = p.user_id WHERE c.id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

app.post('/api/cases/:id/generate-summary', async (req, res, next) => {
  try {
    const caseId = req.params.id;
    console.log(`\n======================================================`);
    console.log(`[AI BACKEND BRIDGE] Request received for Case ID: ${caseId}`);
    
    let item = null;
    const result = await query('SELECT * FROM cases WHERE id = $1', [caseId]).catch(() => ({ rows: [] }));
    if (result && result.rows && result.rows[0]) {
      item = result.rows[0];
    }

    const payload = {
      chiefComplaint: item?.chief_complaint || req.body?.chiefComplaint || req.body?.socrates?.chiefComplaint || 'Chest discomfort & dyspnea',
      historyOfPresentIllness: item?.history_of_present_illness || req.body?.historyOfPresentIllness || 'Acute onset 2 hours ago with radiation',
      pastMedicalHistory: item?.past_medical_history || req.body?.pastMedicalHistory || 'Hypertension',
      pastSurgicalHistory: item?.past_surgical_history || req.body?.pastSurgicalHistory || 'None',
      drugHistory: item?.drug_history || req.body?.drugHistory || 'Amlodipine 5mg',
      allergyHistory: item?.allergy_history || req.body?.allergyHistory || 'NKDA',
      familyHistory: item?.family_history || req.body?.familyHistory || 'Father CAD',
      personalHistory: item?.personal_history || req.body?.personalHistory || 'Non-smoker',
    };

    console.log(`[AI BACKEND BRIDGE] Forwarding payload to Python AI Service (${AI_SERVICE_URL()})...`);
    console.log(`   Chief Complaint: "${payload.chiefComplaint}"`);

    const ai = await generateHistorySummary(payload);

    console.log(`[AI BACKEND BRIDGE] AI Service Response Received! Model: ${ai.modelName}`);
    console.log(`   Summary Snippet: ${ai.summary.slice(0, 100)}...`);
    console.log(`======================================================\n`);

    if (item) {
      await query(
        `INSERT INTO ai_summaries (case_id, summary, structured_data, red_flags, model_name)
         VALUES ($1,$2,$3::jsonb,$4::jsonb,$5) ON CONFLICT DO NOTHING`,
        [item.id, ai.summary, JSON.stringify(ai.structuredData || {}), JSON.stringify(ai.redFlags || []), ai.modelName || 'aditee-ai-service']
      ).catch(() => {});
      await query('UPDATE cases SET red_flags = $1::jsonb WHERE id = $2', [JSON.stringify(ai.redFlags || []), item.id]).catch(() => {});
    }

    res.json({
      success: true,
      data: {
        summary: ai.summary,
        structured_data: ai.structuredData,
        red_flags: ai.redFlags,
        model_name: ai.modelName || 'aditee-ai-service'
      }
    });
  } catch (err) { next(err); }
});

app.post('/api/cases/:id/assign', requireAuth, requireRole('DOCTOR'), async (req, res, next) => {
  try {
    const doctor = await query('SELECT id FROM doctors WHERE user_id = $1', [req.user.id]);
    const doctorId = doctor.rows[0]?.id || `doc_${req.user.id}`;
    const result = await query('UPDATE cases SET doctor_id = $1, status = \'IN_REVIEW\' WHERE id = $2 RETURNING *', [doctorId, req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

app.post('/api/cases/:id/confirm', requireAuth, requireRole('DOCTOR'), async (req, res, next) => {
  try {
    const result = await query('UPDATE cases SET status = \'CONFIRMED\', doctor_notes = COALESCE($1, doctor_notes) WHERE id = $2 RETURNING *', [req.body.doctorNotes || null, req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// 5. DOCUMENT ROUTES
// ---------------------------------------------------------------------------
app.post('/api/documents/upload', requireAuth, requireRole('PATIENT'), upload.single('document'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Document file is required' });

    const patientId = await getPatientId(req.user.id);
    const result = await query(
      'INSERT INTO documents (patient_id, case_id, original_name, stored_name, mime_type, file_path, document_type) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [patientId, req.body.caseId || null, req.file.originalname, req.file.filename, req.file.mimetype, req.file.path, req.body.documentType || 'other']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

app.get('/api/documents', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = await getPatientId(req.user.id);
    const result = await query('SELECT * FROM documents WHERE patient_id = $1 ORDER BY created_at DESC', [patientId]);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
});

app.post('/api/documents/:id/extract', requireAuth, async (req, res, next) => {
  try {
    const docRes = await query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    const doc = docRes.rows[0];
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    const result = await extractDocument(doc.file_path);
    const updated = await query('UPDATE documents SET ocr_text = $1, extracted_data = $2::jsonb WHERE id = $3 RETURNING *', [result.ocrText, JSON.stringify(result.extractedData || {}), doc.id]);

    res.json({ success: true, data: updated.rows[0] });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// 6. CONSENT ROUTES
// ---------------------------------------------------------------------------
app.post('/api/consents', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = await getPatientId(req.user.id);
    const { purpose, consentText } = req.body;
    const result = await query('INSERT INTO consents (patient_id, purpose, consent_text) VALUES ($1,$2,$3) RETURNING *', [patientId, purpose, consentText]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

app.get('/api/consents', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = await getPatientId(req.user.id);
    const result = await query('SELECT * FROM consents WHERE patient_id = $1', [patientId]);
    res.json({ success: true, data: result.rows });
  } catch (err) { next(err); }
});

app.post('/api/consents/:id/revoke', requireAuth, requireRole('PATIENT'), async (req, res, next) => {
  try {
    const patientId = await getPatientId(req.user.id);
    const result = await query('UPDATE consents SET status = \'REVOKED\' WHERE id = $1 AND patient_id = $2 RETURNING *', [req.params.id, patientId]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// 7. ABDM & FHIR ROUTES
// ---------------------------------------------------------------------------
app.post('/api/abdm/abha/send-otp', requireAuth, (req, res) => {
  res.json({ success: true, data: { success: true, message: 'OTP sent', demoOtp: '123456' } });
});

app.post('/api/abdm/abha/verify-otp', requireAuth, async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (otp !== '123456') return res.status(400).json({ success: false, message: 'Invalid OTP' });

    const patientId = await getPatientId(req.user.id);
    if (patientId) {
      await query('UPDATE patients SET abha_number = $1, abha_address = $2 WHERE id = $3', ['12-3456-7890-1234', `${phone}@abha`, patientId]);
    }
    res.json({ success: true, data: { verified: true, abhaNumber: '12-3456-7890-1234', abhaAddress: `${phone}@abha` } });
  } catch (err) { next(err); }
});

app.post('/api/abdm/abha/verify', requireAuth, async (req, res, next) => {
  try {
    const { abhaNumber, abhaAddress } = req.body;
    const patientId = await getPatientId(req.user.id);
    if (patientId) {
      await query('UPDATE patients SET abha_number = $1, abha_address = $2 WHERE id = $3', [abhaNumber || '12-3456-7890-1234', abhaAddress || 'demo@abha', patientId]);
    }
    res.json({ success: true, data: { verified: true, abhaNumber: abhaNumber || '12-3456-7890-1234', abhaAddress: abhaAddress || 'demo@abha' } });
  } catch (err) { next(err); }
});

app.get('/api/abdm/fhir/case/:caseId', requireAuth, async (req, res, next) => {
  try {
    const cRes = await query('SELECT * FROM cases WHERE id = $1', [req.params.caseId]);
    const c = cRes.rows[0];
    if (!c) return res.status(404).json({ success: false, message: 'Case not found' });

    const pRes = await query('SELECT p.*, u.name FROM patients p JOIN users u ON u.id = p.user_id WHERE p.id = $1', [c.patient_id]);
    const p = pRes.rows[0] || {};

    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        { resource: { resourceType: 'Patient', id: p.id, name: [{ text: p.name }], telecom: p.phone ? [{ system: 'phone', value: p.phone }] : [] } },
        { resource: { resourceType: 'Composition', id: c.id, status: 'preliminary', title: 'Clinical Summary', section: [{ title: 'Chief Complaint', text: c.chief_complaint }] } },
      ],
    };
    res.json({ success: true, data: bundle });
  } catch (err) { next(err); }
});

app.get('/api/abdm/fhir/patient/:patientId', requireAuth, async (req, res, next) => {
  try {
    const pRes = await query('SELECT p.*, u.name FROM patients p JOIN users u ON u.id = p.user_id WHERE p.id = $1', [req.params.patientId]);
    const p = pRes.rows[0] || {};
    const cases = await query('SELECT * FROM cases WHERE patient_id = $1', [req.params.patientId]);
    const docs = await query('SELECT * FROM documents WHERE patient_id = $1', [req.params.patientId]);

    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        { resource: { resourceType: 'Patient', id: p.id, name: [{ text: p.name }] } },
        ...cases.rows.map(c => ({ resource: { resourceType: 'DocumentReference', id: c.id, description: c.chief_complaint } })),
        ...docs.rows.map(d => ({ resource: { resourceType: 'DocumentReference', id: d.id, content: [{ attachment: { title: d.original_name, extractedText: d.ocr_text } }] } })),
      ],
    };
    res.json({ success: true, data: bundle });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// Error Handling Middleware
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 MediKiosk Single All-In-One Backend running on http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
