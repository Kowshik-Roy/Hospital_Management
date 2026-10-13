# 🏥 CarePulse Hospital & Medical Center Management System (HIS / EMR)
### আধুনিক হাসপাতাল তথ্য ও স্বাস্থ্য ব্যবস্থাপনা সিস্টেম

> 🌐 **Live Website (সরাসরি লাইভ দেখুন):**

> The live site is deployed from the `main` branch using GitHub Actions.

An enterprise-grade, full-stack Hospital Information System (HIS) with Electronic Medical Records (EMR), Doctor Appointment Booking, Real-Time ICU/CCU Bed Occupancy Tracking, Automated POS Invoicing & Billing, and 24/7 AI Medical Triage Assistant (Bengali & English).

---

## 🌟 Tech Stack Architecture

This project is built using modern standards across the full development stack:

| Layer | Technologies | Purpose |
|---|---|---|
| **Structure (HTML)** | Semantic HTML5, WAI-ARIA | Accessible, SEO-optimized markup, accessible dialogs, native form validation |
| **Styling (CSS)** | CSS3, Tailwind CSS v4, Custom Design Tokens | Medical glassmorphism, dynamic gradients, smooth micro-interactions, responsive grids, official invoice print stylesheet |
| **Frontend Logic (JS / TS)** | JavaScript (ES2024), TypeScript 5.8+ | Strongly typed domain entities, POS calculators, client-side validation, PDF generators |
| **UI Framework (React)** | React 19, Motion, Lucide Icons | Component-driven UI, multi-role portal switcher (Patient, Doctor, Admin, Cashier), interactive modals |
| **Backend (Node.js)** | Express, TypeScript, tsx | Local API server & Google Gemini AI proxy for Medical Triage |
| **Backend (Java)** | Java 17+, Spring Boot 3.2.x | Enterprise REST API service with Patient, Doctor, Appointment, Bed, and Billing controllers |

---

## 🚀 Key Modules & Features

1. **Patient Health Portal & EMR Records**:
   - Patient profile with blood group, allergies, chronic conditions, and emergency contacts.
   - Doctor directory with department filters (Cardiology, Neurology, Pediatrics, Orthopedics).
   - Real-time appointment booking with instant ticket and token generation.
   - Diagnostic lab test reports preview & medical invoices history.

2. **Hospital Management & OPD Doctors Portal**:
   - Real-time doctor consultation queue and schedule manager.
   - Digital prescription pad with dosage instructions, medicine list, and doctor notes.
   - 1-click status transitions (`confirmed`, `in-consultation`, `completed`).

3. **Admin Super Control Command Center**:
   - Executive dashboard with hospital stats (revenue, occupancy, doctors on duty).
   - Bed occupancy controller with live increment/decrement per ward (ICU, CCU, General, VIP Cabin).
   - Doctor roster manager with fee schedules and department assignment.
   - Patient admission registry.

4. **Dedicated Hospital Billing & POS Counter**:
   - Itemized invoice creation for OPD consultations, diagnostic tests, bed charges, and pharmacy.
   - Instant calculation of subtotal, VAT/tax, discounts, and payment methods (bKash, Nagad, Card, Cash).
   - Printable official hospital receipts with hospital logo and registration number.

5. **24/7 Emergency & Critical Care Center**:
   - Live ICU/CCU bed vacancy counter.
   - One-touch emergency hotline (`16263`) and ambulance dispatch calling.
   - Blood bank supply tracker across major blood groups (O-, A+, B+, AB+).

6. **CarePulse AI Medical Assistant**:
   - Multilingual 24/7 medical assistant supporting both Bangla and English.
   - Automated symptom triage and specialist department recommendations.

7. **Nurse Portal (demo workspace)**:
   - Ward/shift-scoped patient roster and patient detail drawer with allergies, history, doctor notes, medications, and recent observations.
   - Vital-sign capture and SpO₂ trend chart; readings below 90% raise an on-screen escalation alert.
   - Medication administration, nursing notes, shift handover, procedure checklist, lab status tracking, emergency log, bed actions, supply requests, and notifications.
   - Nurse workspace records are sample data held in browser memory. They do not persist to a database or send clinical alerts, and the portal is not a substitute for a production clinical system.

8. **Receptionist Front Desk Portal (demo workspace)**:
   - Patient search/registration with generated patient IDs and MRNs; appointment booking, rescheduling, cancellation, identity-confirmed check-in, walk-ins, queue tokens, skips, and doctor reassignment.
   - Admission requests, emergency triage intake, bed occupancy view, document intake, billing support, communication drafts, referral requests, and notifications.
   - Reception access excludes clinical notes, prescriptions, nursing records, payment posting, and financial reports. This workspace uses browser-session demo data; documents, messages, alerts, appointments, and approvals are not sent to connected hospital systems.

9. **Accountant & Billing Portal (demo workspace)**:
   - Finance dashboard with collection, outstanding invoice, insurance claim, expense, refund, and departmental revenue summaries.
   - Create and review invoices, record payments, track insurance claims, admission/pharmacy/laboratory billing, expenses, supplier payables, refunds, financial reports, and notifications.
   - The accountant workspace is role-protected in the UI and does not expose clinical notes, prescriptions, or nursing records. Its sample transactions and workflow updates stay in browser memory; live persistence and department integrations require backend/API connections. Financial exports are Excel-compatible CSV, and printable reports can be saved as PDF from the browser.

10. **Laboratory Information System (demo workspace)**:
   - Role-specific laboratory dashboard, clinician-originated test queue, sample collection/receipt/tracking with generated sample IDs and QR labels, processing, structured results, supervisor verification, report PDF/print, critical-result flags, inventory, billing requests, notifications, and lab analytics.
   - Lab staff can manage laboratory workflow without editing prescriptions, medical history, or billing amounts. The demo uses local in-memory records only; result alerts are on-screen and are not sent to clinical teams, and LIS records are not persisted or synced with Doctor, Patient, Receptionist, Accountant, inventory, or HR systems.

---

## 🛠️ How to Run Locally

### 1. Frontend (React + Vite + Node/Express)
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Configure environment (optional Gemini AI API Key)
cp .env.example .env

# 3. Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** or **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2. Enterprise Java Backend (Spring Boot)
A complete Java Spring Boot backend is provided in the `backend-java` directory:
```bash
# Navigate to the Java backend directory
cd backend-java

# Run using Maven
mvn clean spring-boot:run
```
Java REST API runs at: **`http://localhost:8080`**

---

## 📂 Project Directory Structure

```
Hospital_management/
├── backend-java/                  # Enterprise Java Spring Boot Backend
│   ├── pom.xml                    # Maven configuration
│   └── src/main/java/com/carepulse/hospital/
│       ├── HospitalManagementApplication.java
│       ├── config/WebMvcCorsConfig.java
│       ├── controller/            # REST Controllers (Patient, Doctor, Appointment, Billing, Hospital, AI)
│       ├── dto/                   # Request/Response DTOs
│       ├── model/                 # Domain Entities (Patient, Doctor, Appointment, Invoice, BedCategory)
│       └── service/               # Hospital Business Service & In-Memory Store
├── src/                           # Modern React 19 Frontend
│   ├── components/
│   │   ├── AdminPortal.tsx        # Admin Command Center
│   │   ├── AiChatbot.tsx          # 24/7 Medical Triage Assistant
│   │   ├── AppointmentModal.tsx   # Doctor Booking Flow
│   │   ├── BillingSystem.tsx      # POS Billing & Receipt Generator
│   │   ├── DoctorPortal.tsx       # OPD Doctor Station & Prescription Pad
│   │   ├── EmergencySection.tsx   # 24/7 ICU & Ambulance Section
│   │   ├── Header.tsx             # Brand Header & Portal Navigation
│   │   ├── HospitalSettingsModal.tsx # White-label Branding Settings
│   │   ├── LoginPage.tsx          # 3-Role Authentication Portal
│   │   ├── PatientPortal.tsx      # Patient EMR & Doctor Booking Grid
│   │   ├── NursePortal.tsx        # Ward-scoped Nursing Dashboard & demo workflows
│   │   └── SymptomCheckerModal.tsx # AI Triage Modal
│   ├── data/                      # Initial Hospital Data Seed
│   ├── i18n/                      # Bengali & English Translations
│   ├── types/                     # TypeScript Domain Models
│   ├── App.tsx                    # Main Layout & State Orchestration
│   ├── index.css                  # CSS3 Design System & Glassmorphism
│   └── main.tsx                   # React DOM Entrypoint
├── index.html                     # Semantic HTML5 Entrypoint
├── package.json                   # Node.js dependencies & scripts
├── server.ts                      # Express API server & Gemini AI backend
└── tsconfig.json                  # TypeScript Compiler Configuration
```

---

## 🔒 License & Copyright
Developed for CarePulse Hospital & Medical Center. All rights reserved.
