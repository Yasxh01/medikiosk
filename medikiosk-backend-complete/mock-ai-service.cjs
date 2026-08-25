// mock-ai-service.js
// A FAKE stand-in for Aditee's real FastAPI AI service + the ABDM mock adapters.
// Matches the exact request/response shapes services/ai.service.js and
// services/abdm.adapter.js already send and expect, so it's a true drop-in —
// swap AI_SERVICE_URL / ABDM_MOCK_URL to Aditee's real URLs later with no code changes here.
//
// Run standalone: node mock-ai-service.js
// Uses the same express/multer deps already in this project's package.json.

const express = require("express");
const multer = require("multer");
const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const PORT = process.env.MOCK_PORT || 8001;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- AI SERVICE ENDPOINTS (matches services/ai.service.js) ----------

// POST /generate-summary
// Sent as: { history: <StructuredHistory>, documents: [], patient: {} }
// Expected reply field: summary_text
app.post("/generate-summary", async (req, res) => {
  await delay(300);
  const { history } = req.body || {};

  if (!history) {
    return res.status(400).json({ error: true, message: "history is required" });
  }

  res.json({
    summary_text: `${history.chief_complaint || "Unspecified complaint"} reported. No red flag symptoms indicated by structured history. Recommend routine clinical evaluation.`,
    generatedAt: new Date().toISOString(),
  });
});

// POST /red-flags
// Sent as: { text: <chiefComplaint>, history: <StructuredHistory> }
// Expected reply fields: priority ('EMERGENCY' | 'URGENT' | 'ROUTINE'), red_flags
app.post("/red-flags", async (req, res) => {
  await delay(200);
  const { text } = req.body || {};

  if (typeof text !== "string") {
    return res.status(400).json({ error: true, message: "text is required" });
  }

  // Randomly trigger a red flag ~30% of the time so the demo has both cases to show
  const triggerFlag = Math.random() < 0.3;

  res.json({
    red_flags: triggerFlag
      ? [{ label: "High fever with breathlessness", severity: "high" }]
      : [],
    priority: triggerFlag ? "EMERGENCY" : "ROUTINE",
  });
});

// POST /extract-document (multipart/form-data, field name: "file")
// Expected reply field: extraction.raw_text (plus extraction object)
app.post("/extract-document", upload.single("file"), async (req, res) => {
  await delay(400);

  if (!req.file) {
    return res.status(400).json({ error: true, message: "file is required" });
  }

  res.json({
    extraction: {
      raw_text: "Patient advised Paracetamol 500mg twice daily for 3 days.",
      entities: [
        { type: "medication", value: "Paracetamol" },
        { type: "dosage", value: "500mg twice daily" },
        { type: "date", value: new Date().toISOString().split("T")[0] },
      ],
    },
  });
});

// ---------- ABDM MOCK ADAPTERS (matches services/abdm.adapter.js — unchanged) ----------

// POST /mock/verify-abha
app.post("/mock/verify-abha", async (req, res) => {
  await delay(250);
  const { abhaId } = req.body || {};

  if (!abhaId) {
    return res.status(400).json({ error: true, message: "abhaId is required" });
  }

  res.json({
    verified: true,
    name: "Demo Patient",
    dob: "1998-05-14",
    gender: "female",
  });
});

// POST /mock/verify-hpr
app.post("/mock/verify-hpr", async (req, res) => {
  await delay(250);
  const { hprId } = req.body || {};

  if (!hprId) {
    return res.status(400).json({ error: true, message: "hprId is required" });
  }

  res.json({
    verified: true,
    doctorName: "Dr. Demo Sharma",
    specialization: "General Medicine",
    registrationNumber: "HPR-2024-00123",
  });
});

// Health check
app.get("/health", (req, res) => res.json({ status: "mock AI service running" }));

app.listen(PORT, () => {
  console.log(`Mock AI + ABDM service running on http://localhost:${PORT}`);
  console.log("Endpoints: /generate-summary /red-flags /extract-document /mock/verify-abha /mock/verify-hpr");
});
