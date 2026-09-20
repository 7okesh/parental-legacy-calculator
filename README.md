# Quantum Vedic — Parental Legacy & Life Factors Calculator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://parental-legacy-calculator-2v4a.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/7okesh/parental-legacy-calculator)

A production-grade full-stack MERN application that evaluates a candidate's Date of Birth (DOB) and computes parental legacy influence across **7 core psychological and biological life factors** with strict mathematical invariant compliance.

🌐 **Live Application:** [https://parental-legacy-calculator-2v4a.onrender.com](https://parental-legacy-calculator-2v4a.onrender.com)  
📁 **GitHub Repository:** [https://github.com/7okesh/parental-legacy-calculator](https://github.com/7okesh/parental-legacy-calculator)  
👤 **Author:** Lokesh Prajapati ([7okeshprajapati23@gmail.com](mailto:7okeshprajapati23@gmail.com) | +91-9022398228)  

---

## ⚡ Core Features

- **Dynamic Parity Engine:** Odd/Even day calculation logic strictly compliant with assessment specifications.
  - **Odd Days (1, 3, 5, ..., 31):** Mother's values dominate ($\Sigma = 51.837\%$, Father $\Sigma = 48.163\%$).
  - **Even Days (2, 4, ..., 30):** Father's values dominate ($\Sigma = 51.837\%$, Mother $\Sigma = 48.163\%$).
  - **Dominance Delta:** Exactly $3.67\%$ difference between dominant and non-dominant parent.
- **Strict Invariants:**
  - $\text{Mother Value}_i + \text{Father Value}_i = \text{Total Combined Value}_i$ for every factor.
  - $\sum \text{Mother} + \sum \text{Father} = 100.000$ strictly.
- **Interactive Visualizations (Recharts):** Comparative Grouped Bar Chart, 7-axis Radar Balance Map, and Influence Donut Breakdown.
- **Executive Reporting:** One-click PDF generation (`jsPDF` + `jspdf-autotable`) and CSV data download.
- **Spreadsheet Ingestion:** Built-in `.xlsx` upload to parse and analyze custom factor matrices.
- **JWT Authentication & History:** Token-based authentication with bcrypt password hashing and saved calculation records.
- **Dual-Engine Resilience:** Seamlessly uses local in-memory persistence if MongoDB is disconnected.
- **Theme Support:** Polished Dark Tech theme with Light theme switcher.

---

## 📊 Life Factor Specification & Boundaries

| # | Life Factor | Min Limit | Max Limit | Mother Dominant (Odd) | Father Dominant (Even) | Combined Total |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | **Genetic Inheritance** | 9.333 | 10.777 | M: **10.719** \| F: 10.233 | M: 10.233 \| F: **10.719** | **20.952** |
| 2 | **Constitutional Vitality** | 8.111 | 9.111 | M: **8.545** \| F: 8.198 | M: 8.198 \| F: **8.545** | **16.743** |
| 3 | **Mental Patterns** | 6.111 | 7.111 | M: **6.611** \| F: 6.588 | M: 6.588 \| F: **6.611** | **13.199** |
| 4 | **Intellectual Capacity** | 6.333 | 6.999 | M: **6.443** \| F: 6.316 | M: 6.316 \| F: **6.443** | **12.759** |
| 5 | **Emotional Foundation** | 7.111 | 7.999 | M: **7.382** \| F: 6.606 | M: 6.606 \| F: **7.382** | **13.988** |
| 6 | **Spiritual Lineage** | 5.011 | 6.011 | M: **5.975** \| F: 5.109 | M: 5.109 \| F: **5.975** | **11.084** |
| 7 | **Soul Connections** | 5.111 | 6.222 | M: **6.162** \| F: 5.113 | M: 5.113 \| F: **6.162** | **11.275** |
| | **TOTAL** | — | — | **51.837** \| **48.163** | **48.163** \| **51.837** | **100.000** |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, jsPDF, SheetJS (xlsx).
- **Backend:** Node.js (ES Modules), Express.js, Helmet, CORS, Express-Rate-Limit, Multer.
- **Database:** MongoDB / Mongoose (with automated in-memory storage fallback).
- **Auth & Security:** JWT (JSON Web Tokens), bcryptjs password hashing.
- **Deployment:** Render (Unified Full-Stack Node Web Service).

---

## 💻 Local Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/7okesh/parental-legacy-calculator.git
cd parental-legacy-calculator
npm run install:all
```

### 2. Environment Setup
A template is provided in `server/.env.example`.
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/parental_legacy_db
JWT_SECRET=super_secret_jwt_key_quantum_vedic_2026_production
CLIENT_URL=http://localhost:5173
```
*(Note: If MongoDB is not running locally, the server automatically boots with in-memory persistence).*

### 3. Run Development Server
```bash
# Runs backend (:5000) and frontend (:5173) concurrently
npm run dev
```

### 4. Run Automated Test Verification
```bash
node server/testCalculation.js
```

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Service health and developer status | Public |
| `POST` | `/api/calculator/calculate` | Compute legacy factors for given DOB (`{ "dob": "DD/MM/YYYY" }`) | Public |
| `POST` | `/api/calculator/save` | Save calculation session | Optional (Bearer) |
| `GET` | `/api/calculator/history` | Retrieve saved calculations | Optional (Bearer) |
| `POST` | `/api/upload/excel` | Parse `.xlsx` spreadsheet and extract factor matrix | Public |
| `POST` | `/api/auth/register` | User registration (`{ name, email, password }`) | Public |
| `POST` | `/api/auth/login` | User login (`{ email, password }`) | Public |
| `GET` | `/api/auth/me` | Current authenticated user profile | Bearer Token |

---

## 📄 Submission Contact

- **Candidate:** Lokesh Prajapati
- **Phone:** +91-9022398228
- **Email:** 7okeshprajapati23@gmail.com
- **Target WhatsApp:** 8454815742
