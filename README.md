# AI-Powered FAQ Generator and Chatbot for a College Department

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-teal.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen.svg)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-42%20Passed-success.svg)]()

> **DISCLAIMER:**  
> **SAMPLE DATA — NOT VERIFIED COLLEGE INFORMATION.**  
> All questions, answers, fees, deadlines, and policies included in this project are illustrative samples prepared for a college practical assignment (25 marks). They do not represent verified institutional information.

---

## 📖 1. Project Overview

The **AI-Powered FAQ Generator and Chatbot for a College Department** is a responsive web application designed to maintain a structured institutional knowledge base, accept student queries through a modern chatbot interface, retrieve relevant information deterministically, and provide grounded answers.

A primary requirement of the system is **answer safety**: when an inquiry falls outside the department's knowledge base, the application displays a clear, safe fallback instead of hallucinating or inventing institutional details. Furthermore, the application is fully functional offline without AI provider credentials, with optional support for NVIDIA Nemotron when configured.

---

## ✨ 2. Key Features

- **34 Structured FAQs Across 7 Essential Categories:** Admissions, Courses, Fees & Scholarships, Examinations, Facilities, Placements, and Department Support.
- **Deterministic FAQ Retrieval Engine:** Normalization, stopword removal, stemming, token overlap, multi-word keyword scoring, and confidence thresholding.
- **Answer Safety & Hallucination Prevention:** Automatic fallback mechanism for absent queries and prompt injection attempts.
- **Optional Modular Nemotron AI Grounding:** Strict context injection ensures the LLM never answers from pre-trained generic knowledge.
- **Modern Responsive React UI:** Warm neutral palette, blue/teal accents, interactive suggestion chips, verified source badges, copy action, and conversation clearing.
- **Zero Credentials Requirement:** Runs 100% locally out of the box.
- **Automated Verification:** 42 Vitest unit and integration tests covering knowledge base schema, retrieval algorithms, REST endpoints, and AI fallbacks.
- **Markdown Documentation Generator:** One-click script to generate formatted documentation from the JSON knowledge base.

---

## 🛠️ 3. Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React (ES modules)
- **Backend:** Node.js, Express.js (REST API, CORS, size-limiting middleware)
- **Knowledge Base:** JSON with Zod validation
- **Testing:** Vitest, Supertest
- **Optional AI:** NVIDIA Nemotron (via OpenAI-compatible endpoint)

---

## 📁 4. Project Directory Structure

```
D:\GenAI\Q1
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              # Department branding & status banner
│   │   │   ├── WelcomeSection.jsx      # Topic overview cards
│   │   │   ├── ChatWindow.jsx          # Auto-scrolling message list
│   │   │   ├── ChatMessage.jsx         # User & bot bubbles with source badges
│   │   │   ├── ChatInput.jsx           # Input field with char counter
│   │   │   ├── SuggestedQuestions.jsx  # Interactive suggestion chips
│   │   │   └── LoadingIndicator.jsx    # Pulsing search indicator
│   │   ├── services/
│   │   │   └── api.js                  # Centralized API client & error handling
│   │   ├── App.jsx                     # Top-level state and health polling
│   │   ├── main.jsx                    # React entrypoint
│   │   └── index.css                   # Tailwind styles
│   ├── index.html                      # HTML root
│   ├── package.json                    # Client dependencies
│   ├── tailwind.config.js              # Theme and color tokens
│   └── vite.config.js                  # Vite server & backend proxy
│
├── server/                     # Backend API & Retrieval Engine
│   ├── kb/
│   │   └── faqs.json                   # Structured JSON Knowledge Base (34 FAQs)
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── error-handler.js        # Safe 400/404/500 error middleware
│   │   │   └── validate.js             # Zod request validation middleware
│   │   ├── routes/
│   │   │   └── faq.routes.js           # /api/health, /api/faq/list, /api/faq/ask
│   │   ├── services/
│   │   │   ├── ai.service.js           # Modular Nemotron grounding & fallback
│   │   │   ├── faq.service.js          # Knowledge base coordinator
│   │   │   └── retrieval.service.js    # Deterministic search algorithm
│   │   ├── validators/
│   │   │   └── faq.schema.js           # Zod schema definitions
│   │   ├── app.js                      # Express configuration
│   │   └── index.js                    # Server entrypoint
│   ├── scripts/
│   │   ├── validate-kb.js              # Validates KB against Zod schema
│   │   └── generate-faq-doc.js         # Generates Markdown documentation
│   ├── tests/
│   │   ├── ai.service.test.js          # Grounding & timeout tests
│   │   ├── api.test.js                 # Supertest REST API tests
│   │   ├── kb.schema.test.js           # Knowledge base validation tests
│   │   └── retrieval.test.js           # Retrieval & ambiguity tests
│   ├── .env.example                    # Template environment variables
│   └── package.json                    # Server dependencies & test scripts
│
├── docs/                       # Project Documentation
│   ├── api.md                          # REST API specification
│   ├── architecture.md                 # System architecture & sequence diagrams
│   ├── college-faqs.md                 # Auto-generated FAQ Markdown catalog
│   ├── manual-test-plan.md             # 10 test case specifications & UI checklist
│   └── test-report.md                  # Automated, build, & live verification results
│
├── .gitignore                  # Git exclusions (node_modules, .env, dist)
└── README.md                   # Complete project reference (this file)
```

---

## ⚡ 5. Prerequisites

- **Operating System:** Windows 10/11 (or macOS / Linux)
- **Node.js:** v18+ (tested on Node.js v22.17.0)
- **Package Manager:** npm v10+ (tested on npm 10.9.2)
- **Web Browser:** Modern Chromium, Firefox, or Edge

---

## 🚀 6. Installation & Execution Guide

### Step 1: Install Dependencies

Open a PowerShell terminal and run:

```powershell
# 1. Install Backend Dependencies
cd D:\GenAI\Q1\server
npm install

# 2. Install Frontend Dependencies
cd D:\GenAI\Q1\client
npm install
```

---

### Step 2: Validate Knowledge Base & Generate Docs

From the `server` directory:

```powershell
cd D:\GenAI\Q1\server

# Validate the structured knowledge base against Zod schemas
npm run validate:kb

# Auto-generate docs/college-faqs.md from the JSON knowledge base
npm run generate:faq-doc
```

---

### Step 3: Run Automated Test Suite

```powershell
cd D:\GenAI\Q1\server
npm test
```
*Expected: 42 passed tests across all 4 test suites.*

---

### Step 4: Start the Applications

Run the backend and frontend in separate PowerShell terminals:

#### Terminal 1 — Backend API Server:
```powershell
cd D:\GenAI\Q1\server
npm start
```
*Backend runs on `http://localhost:5000`.*

#### Terminal 2 — Frontend Development Server:
```powershell
cd D:\GenAI\Q1\client
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

Open your web browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📡 7. API Reference & Verification Examples

### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
```

### Supported Question Query
```powershell
$body = @{ question = "How can I apply for admission to the college?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/faq/ask" -Method Post -ContentType "application/json" -Body $body
```

### Unsupported Question Query (Fallback Verification)
```powershell
$body = @{ question = "Can I bring my pet iguana into the chemistry laboratory?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/faq/ask" -Method Post -ContentType "application/json" -Body $body
```

---

## 🤖 8. Optional Nemotron Configuration

The application operates in pure deterministic retrieval mode by default (`AI_ENABLED=false`). If you have access to an NVIDIA Nemotron API endpoint:

1. Copy `.env.example` in `server/` to `.env`:
   ```powershell
   Copy-Item D:\GenAI\Q1\server\.env.example D:\GenAI\Q1\server\.env
   ```
2. Set configuration values:
   ```ini
   AI_ENABLED=true
   NEMOTRON_API_KEY=your_actual_nvidia_api_key
   NEMOTRON_BASE_URL=https://integrate.api.nvidia.com/v1
   NEMOTRON_MODEL=nvidia/nemotron-4-340b-instruct
   ```
3. Restart the backend server.
4. **Safety Rule:** The model will only be called when a verified knowledge base match exists, and it is strictly constrained to the retrieved FAQ context. Unsupported questions never invoke the model.

---

## 🔒 9. Security & Safeguards

- **Input Size & Type Constraints:** Zod rejects queries exceeding 500 characters, empty inputs, or non-string values.
- **Payload Limits:** Maximum JSON payload size capped at 16kb.
- **Credential Protection:** Secrets and environment variables are strictly server-side and excluded via `.gitignore`.
- **Safe Rendering:** React JSX eliminates arbitrary HTML injection vulnerabilities (XSS safe).
- **Prompt-Injection Defense:** Automatic pattern matching returns safe fallback for adversarial prompts.

---

## ⚠️ 10. Limitations & Boundaries

1. **Sample Data Limitation:** The current dataset of 34 FAQs is illustrative. Real institutional deployment requires replacing `faqs.json` with verified departmental policies.
2. **Deterministic Retrieval:** The keyword/token-overlap engine is tuned for accuracy over guessing. Paraphrases sharing core concepts are recognized, but completely novel phrasing without shared terms will trigger the safe fallback.
3. **No External Database:** Uses an in-memory loaded JSON knowledge base suitable for departmental deployments under 1,000 FAQs without database overhead.
