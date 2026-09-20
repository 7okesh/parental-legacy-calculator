# Quantum Vedic — Parental Legacy & Life Factors Calculator

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Security-JWT%20%2B%20bcrypt-red.svg)](https://jwt.io/)

A full-stack MERN web application engineered for the **MERN Full Stack Developer Technical Assessment**. The system calculates, analyzes, and visualizes maternal and paternal legacy contributions across **7 core biological and psychological life factors** based on candidate Date of Birth (DOB).

---

## Candidate Information

- **Name:** Lokesh Prajapati
- **Role:** Senior Full Stack Developer (MERN)
- **Contact:** +91-9022398228
- **Email:** 7okeshprajapati23@gmail.com
- **Submission Target:** WhatsApp +91-8454815742 & GitHub Repository

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Mathematical Invariants & Business Logic](#mathematical-invariants--business-logic)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites & Installation](#prerequisites--installation)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Verification & Test Results](#verification--test-results)
10. [Bonus Features & Enterprise Engineering](#bonus-features--enterprise-engineering)
11. [Git Commit History](#git-commit-history)

---

## Executive Summary

The **Quantum Vedic Legacy Analytics** platform implements an end-to-end analytical pipeline designed around the provided assessment materials:
1. `Assessment Task.pdf` (Requirements, constraints, evaluation rubric)
2. `tteesstt.xlsx` (Factor ranges, boundary limits, baseline calculations)
3. `tteesstt.mp4` (Reference production UI, live calculation behavior, calendar workflow)

### Key Capabilities
- **Precision Parity Engine:** Odd/Even day calculation logic strictly compliant with PDF and video references.
- **Interactive Visualizations:** Comparative Grouped Bar Charts, 7-axis Radar Balance Wheel, and Influence Donut Breakdown powered by Recharts.
- **Dual Engine Architecture:** Full Express + MongoDB REST API backend with zero-latency, offline-capable client-side calculation fallback.
- **Enterprise Reporting:** One-click PDF Generation (`jsPDF` + `jspdf-autotable`) and CSV data export.
- **Spreadsheet Ingestion:** Custom `.xlsx` / `.xls` parser to upload and analyze arbitrary factor datasets.
- **Authentication:** JWT-based authentication with bcrypt password hashing and session management.

---

## Mathematical Invariants & Business Logic

### Core Mathematical Laws
1. **Factor Invariant:** For each life factor $i \in \{1 \dots 7\}$:
   $$\text{Mother Value}_i + \text{Father Value}_i = \text{Total Combined Value}_i$$
2. **Grand Total Invariant:**
   $$\sum_{i=1}^{7} \text{Mother Value}_i + \sum_{i=1}^{7} \text{Father Value}_i = 100.000$$
3. **Day Parity Rule:**
   - **Odd Days ($1, 3, 5, \dots, 31$):** Mother values are higher ($\sum \text{Mother} = 51.837$, $\sum \text{Father} = 48.163$).
   - **Even Days ($2, 4, 6, \dots, 30$):** Father values are higher ($\sum \text{Father} = 51.837$, $\sum \text{Mother} = 48.163$).
   - **Dominance Delta:** Exactly $3.67\%$ difference between dominant and non-dominant parent.

### Factor Ranges (Defined in PDF & Excel)

| # | Life Factor | Min Limit | Max Limit | High Profile | Low Profile | Combined Total |
|---|-------------|-----------|-----------|--------------|-------------|----------------|
| 1 | **Genetic Inheritance** | 9.333 | 10.777 | 10.719 | 10.233 | 20.952 |
| 2 | **Constitutional Vitality** | 8.111 | 9.111 | 8.545 | 8.198 | 16.743 |
| 3 | **Mental Patterns** | 6.111 | 7.111 | 6.611 | 6.588 | 13.199 |
| 4 | **Intellectual Capacity** | 6.333 | 6.999 | 6.443 | 6.316 | 12.759 |
| 5 | **Emotional Foundation** | 7.111 | 7.999 | 7.382 | 6.606 | 13.988 |
| 6 | **Spiritual Lineage** | 5.011 | 6.011 | 5.975 | 5.109 | 11.084 |
| 7 | **Soul Connections** | 5.111 | 6.222 | 6.162 | 5.113 | 11.275 |
| | **TOTAL** | — | — | **51.837** | **48.163** | **100.000** |

---

## Architecture & Technology Stack

```
                               ┌────────────────────────┐
                               │   Client Application   │
                               │  (React 18 + Vite +    │
                               │  Tailwind CSS + Lucide │
                               │   + Recharts + jsPDF)  │
                               └───────────┬────────────┘
                                           │
                                           │ HTTP / REST (Axios)
                                           ▼
                               ┌────────────────────────┐
                               │   Express API Server   │
                               │    (Node.js + ES6)     │
                               ├────────────────────────┤
                               │ • Rate Limiter & Helmet│
                               │ • JWT Auth Middleware  │
                               │ • Input Validation     │
                               │ • Calculator Service   │
                               │ • Excel Parser Service │
                               └───────────┬────────────┘
                                           │
                                           │ Mongoose ODM
                                           ▼
                               ┌────────────────────────┐
                               │     MongoDB Atlas      │
                               │  (Collections: users,  │
                               │     calculations)      │
                               └────────────────────────┘
```

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, jsPDF, jsPDF-AutoTable, SheetJS (xlsx).
- **Backend:** Node.js (v20+), Express.js, Helmet, CORS, Express-Rate-Limit, Multer.
- **Database & ODM:** MongoDB, Mongoose (with automated in-memory persistence fallback).
- **Security:** JWT authentication, bcryptjs salt hashing, input sanitization.

---

## Project Structure

```
.
├── client/                                 # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/AuthModal.jsx          # JWT Login / Registration dialog
│   │   │   ├── calculator/
│   │   │   │   ├── DateController.jsx      # Dynamic analysis bar & custom calendar
│   │   │   │   ├── MetricCards.jsx         # 3 KPI cards (Mother, Father, Dominance)
│   │   │   │   ├── FactorTable.jsx         # Breakdown table (3-decimal precision)
│   │   │   │   └── FactorCharts.jsx        # Bar, Radar, and Donut visualizations
│   │   │   ├── history/HistoryModal.jsx    # Saved calculation archive
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx              # Breadcrumb + Export actions
│   │   │   │   └── Sidebar.jsx             # Left navigation with dark/light toggle
│   │   │   └── upload/UploadModal.jsx      # Excel spreadsheet reader
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             # User authentication state
│   │   │   └── ThemeContext.jsx            # Dark / Light theme provider
│   │   ├── services/
│   │   │   ├── api.js                      # Axios HTTP client
│   │   │   ├── calculatorEngine.js         # Pure JS calculation engine (client fallback)
│   │   │   ├── pdfGenerator.js             # Branded PDF generator
│   │   │   └── csvGenerator.js             # CSV dataset generator
│   │   ├── utils/
│   │   │   ├── constants.js                # Default factor ranges & baselines
│   │   │   └── dateUtils.js                # DD/MM/YYYY parser & validators
│   │   ├── App.jsx                         # Main dashboard orchestrator
│   │   └── main.jsx                        # React root entry
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                                 # Backend REST API (Node + Express)
│   ├── config/db.js                        # Resilient MongoDB connector
│   ├── controllers/
│   │   ├── authController.js               # JWT Auth handlers
│   │   ├── calculatorController.js         # Factor computation & history
│   │   └── uploadController.js             # Excel file parsing
│   ├── middleware/
│   │   ├── authMiddleware.js               # JWT bearer verification
│   │   └── errorHandler.js                 # Centralized error handler
│   ├── models/
│   │   ├── User.js                         # Mongoose User schema
│   │   └── CalculationHistory.js           # Mongoose Calculation schema
│   ├── routes/
│   │   ├── authRoutes.js                   # /api/auth
│   │   ├── calculatorRoutes.js             # /api/calculator
│   │   └── uploadRoutes.js                 # /api/upload
│   ├── services/calculationService.js      # Domain calculation engine
│   ├── utils/factorConstants.js            # Reference boundaries
│   ├── server.js                           # Express entry point
│   ├── .env.example
│   └── package.json
│
├── Assessment Task.pdf                     # Original assessment specification
├── tteesstt.mp4                            # Reference UI/UX video demonstration
├── tteesstt.xlsx                           # Reference spreadsheet data
├── package.json                            # Root orchestration scripts
└── README.md                               # Complete documentation
```

---

## Prerequisites & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **MongoDB:** (Optional) MongoDB Community Server or MongoDB Atlas cluster. The system features an automatic in-memory fallback if a local database instance is not running.

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/parental-legacy-calculator.git
cd parental-legacy-calculator
```

### 2. Install All Dependencies
Install root, server, and client dependencies in a single command:
```bash
npm run install:all
```
*Or manually in each folder:*
```bash
npm install
npm install --prefix server
npm install --prefix client
```

---

## Environment Variables

The server uses standard environment variables. A template is provided in `server/.env.example`.

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/parental_legacy_db
JWT_SECRET=super_secret_jwt_key_quantum_vedic_2026_production
CLIENT_URL=http://localhost:5173
```

---

## Running the Application

### Development Mode (Both Frontend & Backend concurrently)
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend Dashboard:** `http://localhost:5173`

### Run Frontend Only
```bash
npm run dev:client
```

### Run Backend Only
```bash
npm run dev:server
```

---

## API Documentation

### 1. Calculation Endpoint
- **Endpoint:** `POST /api/calculator/calculate`
- **Request Body:**
  ```json
  {
    "dob": "03/06/2026"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "dob": "03/06/2026",
      "day": 3,
      "isOddDay": true,
      "dominantParent": "Mother",
      "differencePercentage": 3.67,
      "motherInfluence": 51.84,
      "fatherInfluence": 48.16,
      "motherTotal": 51.837,
      "fatherTotal": 48.163,
      "grandTotal": 100.0,
      "factors": [ ... ],
      "invariantsPassed": {
        "sumEquals100": true,
        "factorSumsValid": true,
        "parityValid": true
      }
    }
  }
  ```

### 2. Save Calculation Session
- **Endpoint:** `POST /api/calculator/save`
- **Headers:** `Authorization: Bearer <token>` (Optional)
- **Response (`201 Created`):** `{ "success": true, "data": { "id": "..." } }`

### 3. Fetch History
- **Endpoint:** `GET /api/calculator/history`
- **Response (`200 OK`):** Array of past calculations sorted by timestamp.

### 4. Excel Upload & Parse
- **Endpoint:** `POST /api/upload/excel`
- **Payload:** `multipart/form-data` with `file: <Test.xlsx>`
- **Response (`200 OK`):** Extracted factors and column sums.

### 5. Authentication Endpoints
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/auth/me` — Requires Bearer Token

---

## Verification & Test Results

| Test ID | Scenario | Input DOB | Expected Output | Status |
|---|---|---|---|---|
| **TC-01** | Odd Day Dominance | `03/06/2026` | Mother: 51.84% (51.837), Father: 48.16% (48.163), Mother Dominant, 3.67% delta | **PASS** |
| **TC-02** | Even Day Dominance | `02/06/2026` | Mother: 48.16% (48.163), Father: 51.84% (51.837), Father Dominant, 3.67% delta | **PASS** |
| **TC-03** | Factor Sum Invariant | Any valid date | Mother[i] + Father[i] = Factor Total[i] | **PASS** |
| **TC-04** | Grand Total Invariant| Any valid date | Sum of Mother + Sum of Father = 100.000 strictly | **PASS** |
| **TC-05** | Date Validation | `31/02/2026` | Error: Invalid date rejected gracefully | **PASS** |
| **TC-06** | Video Pixel Parity | `01/06/2026` | Matches frame 00:00 layout, cards, and red 100.000 total | **PASS** |
| **TC-07** | PDF Export | Click "Export PDF" | Downloads clean branded report | **PASS** |
| **TC-08** | CSV Export | Click "Export CSV" | Downloads structured factor dataset | **PASS** |
| **TC-09** | Offline Resilience | Server Stopped | Client-side engine continues calculations without error | **PASS** |

---

## Bonus Features & Enterprise Engineering

1. **PDF Export (+5 pts):** Custom branded PDF generation with formatted summary cards, metadata, and auto-table styling.
2. **CSV Export (+5 pts):** Standard CSV dataset export for external analysis.
3. **Dark / Light Mode Toggle (+5 pts):** Seamless theme switching with persistent localStorage preference.
4. **Data Persistence (+10 pts):** MongoDB storage with Mongoose schemas and offline localStorage fallback.
5. **JWT User Authentication (+10 pts):** Secure authentication with bcrypt password hashing and token management.
6. **Excel Ingestion:** Upload and parse custom `.xlsx` spreadsheets to dynamically calibrate factor baselines.

---

## Git Commit History

The project follows conventional, atomic commit standards:
- `feat: initialize full stack architecture and environment configurations`
- `feat: implement core calculation engine with strict mathematical invariants`
- `feat: implement express rest api, mongodb schemas, and jwt authentication`
- `feat: construct quantum vedic dark theme layout, sidebar, and header`
- `feat: implement date controller with interactive calendar matching video reference`
- `feat: implement kpi metric cards and detailed factor breakdown table`
- `feat: integrate recharts for comparative bar, radar, and donut visualizations`
- `feat: implement pdf and csv export services`
- `feat: implement excel upload and spreadsheet parsing`
- `docs: add comprehensive production readme and test compliance report`

---

*Submitted by Lokesh Prajapati for the MERN Full Stack Developer Assessment.*
