# 🏥 CarePulse — Hospital & Medical Center Management System

### আধুনিক হাসপাতাল তথ্য ও স্বাস্থ্য ব্যবস্থাপনা সিস্টেম (HIS / EMR)

---

### 🌐 Live Website (সরাসরি লাইভ দেখুন):
👉 **[https://kowshik-roy.github.io/Hospital_Management/](https://kowshik-roy.github.io/Hospital_Management/)**

> ⚡ **Live Status:** The live site is hosted on GitHub Pages from the `gh-pages` and `main` branches.

---

An enterprise-grade, full-stack **Hospital Information System (HIS)** with Electronic Medical Records (EMR), Doctor Appointment Booking, Real-Time ICU/CCU Bed Occupancy Tracking, Automated POS Invoicing & Billing, and a 24/7 AI Medical Triage Assistant (Bengali & English).

---

## 📊 Languages & Technologies Used (ব্যবহৃত ল্যাঙ্গুয়েজ ও টেকনোলজি)

| Language / Technology | File Count | Purpose |
|---|---|---|
| **TypeScript / TSX** | **42 files** (35 `.tsx` + 7 `.ts`) | 🥇 **সবচেয়ে বেশি ব্যবহৃত** — Frontend UI components, Express API server (`server.ts`), types & services |
| **Java** | **22 files** (`.java`) | 🥈 **দ্বিতীয় প্রধান ভাষা** — Enterprise Spring Boot 3.2 REST API backend |
| **CSS** (Tailwind CSS v4) | 1 file | Medical glassmorphism, dynamic gradients, responsive layout & print styles |
| **SQL** | 1 file | PostgreSQL / MySQL database schema (15+ normalized tables) |
| **HTML** | 1 file | Semantic HTML5 entry point with WAI-ARIA |
| **YAML** | 1 file | GitHub Actions CI/CD deployment workflow (`.github/workflows/deploy.yml`) |
| **JSON** | 4 files | Project metadata, dependencies, TypeScript config |

### 🛠️ Full Tech Stack

| Layer | Technologies | Details |
|---|---|---|
| **Frontend Framework** | React 19, TypeScript 5.8+, Vite 8 | Component-driven architecture with multi-role portal switching |
| **Styling** | Tailwind CSS v4, Custom CSS3 | Medical glassmorphism, responsive grids, dark/light accents |
| **Animation** | Motion (Framer Motion) | Smooth page transitions, interactive hover effects |
| **Icons** | Lucide React | 500+ consistent medical & UI icons |
| **Backend (Node.js)** | Express.js, TypeScript, tsx | Local API server + Google Gemini AI proxy |
| **Backend (Java)** | Java 17+, Spring Boot 3.2.x, Maven | Enterprise REST API with CORS, in-memory data store |
| **AI Integration** | Google Gemini API (`@google/genai`) | 24/7 multilingual medical triage assistant |
| **PDF Generation** | jsPDF | Printable hospital receipts, prescriptions, test reports |
| **QR Codes** | qrcode.react | Appointment tokens, patient ID cards, sample tracking |
| **Routing** | React Router DOM v7 | Multi-page navigation with deep linking |
| **Deployment** | GitHub Pages + GitHub Actions | Automated build and live hosting |
| **Database Design** | PostgreSQL / MySQL / SQL Server | 15+ normalized tables with indexes and constraints |

---

## 📂 Complete Project Directory Structure (ফোল্ডার ও ফাইল পরিচিতি)

```
Hospital_management/
│
├── 🌐 index.html                          # Semantic HTML5 entry point
├── 📄 package.json                        # Node.js dependencies & scripts
├── 📄 tsconfig.json                       # TypeScript compiler configuration
├── 📄 vite.config.ts                      # Vite build & dev server config
├── 📄 server.ts                           # Express.js API server + Gemini AI proxy (695 lines)
├── 📄 .env.example                        # Environment variable template (Gemini API key)
├── 📄 metadata.json                       # Project metadata
│
├── 📁 .github/workflows/
│   └── deploy.yml                         # GitHub Actions CI/CD → auto deploy to GitHub Pages
│
├── 📁 database/
│   └── schema.sql                         # Full relational database schema (258 lines, 15+ tables)
│
├── 📁 src/                                # ═══ FRONTEND SOURCE CODE (React 19 + TypeScript) ═══
│   │
│   ├── 📄 main.tsx                        # React DOM entry point (renders <App />)
│   ├── 📄 App.tsx                         # Main application — state orchestration & routing (87K)
│   ├── 📄 index.css                       # Global CSS design system
│   │
│   ├── 📁 components/                     # ═══ ALL UI COMPONENTS ═══
│   │   │
│   │   ├── 📄 LoginPage.tsx               # Multi-role authentication (Patient/Doctor/Admin/Staff)
│   │   ├── 📄 Header.tsx                  # Brand header with portal navigation switcher
│   │   │
│   │   │  ── 🩺 Patient Module ──
│   │   ├── 📄 PatientPortal.tsx           # Patient portal entry & tab navigation
│   │   ├── 📄 PatientCarePortal.tsx       # Full patient care management
│   │   ├── 📁 patient/                    # Patient sub-components:
│   │   │   ├── PatientDashboard.tsx        #   → Health stats & quick actions
│   │   │   ├── PatientProfile.tsx          #   → Profile editor (blood group, allergies, contacts)
│   │   │   ├── PatientOverview.tsx         #   → Health overview with metrics
│   │   │   ├── PatientLoginModal.tsx       #   → Patient authentication modal
│   │   │   ├── PatientRegisterModal.tsx    #   → New patient registration
│   │   │   ├── DoctorSearch.tsx            #   → Doctor directory with department filters
│   │   │   ├── AppointmentBookingWizard.tsx #  → Step-by-step appointment booking flow
│   │   │   ├── AppointmentHistory.tsx      #   → Past & upcoming appointment tracker
│   │   │   ├── PrescriptionList.tsx        #   → Digital prescription viewer
│   │   │   ├── MedicalHistory.tsx          #   → EMR medical records history
│   │   │   ├── TestReportList.tsx          #   → Lab test reports & diagnostics
│   │   │   ├── BillingList.tsx             #   → Invoice & payment history
│   │   │   └── SymptomChecker.tsx          #   → AI-powered symptom analysis
│   │   │
│   │   │  ── 👨‍⚕️ Doctor Module ──
│   │   ├── 📄 DoctorPortal.tsx            # Doctor OPD station & patient queue
│   │   ├── 📄 DoctorClinicalPortal.tsx    # Full clinical workspace & prescription pad
│   │   │
│   │   │  ── 🏢 Admin Module ──
│   │   ├── 📄 AdminPortal.tsx             # Admin control panel
│   │   ├── 📄 AdminCommandPortal.tsx      # Executive command center dashboard
│   │   │
│   │   │  ── 💰 Billing & Finance Module ──
│   │   ├── 📄 BillingSystem.tsx           # POS billing & receipt generator
│   │   ├── 📄 AccountantPortal.tsx        # Finance dashboard & accounting
│   │   │
│   │   │  ── 🚑 Emergency Module ──
│   │   ├── 📄 EmergencySection.tsx        # ICU/CCU bed tracker & ambulance dispatch
│   │   │
│   │   │  ── 👩‍⚕️ Clinical Staff Modules ──
│   │   ├── 📄 NursePortal.tsx             # Ward-scoped nursing dashboard
│   │   ├── 📄 ReceptionistPortal.tsx      # Front desk & patient check-in
│   │   ├── 📄 LaboratoryPortal.tsx        # Lab information system (LIS)
│   │   ├── 📄 PharmacyPortal.tsx          # Pharmacy inventory & dispensing
│   │   ├── 📄 OperationsPortal.tsx        # Hospital operations management
│   │   │
│   │   │  ── 🤖 AI Module ──
│   │   ├── 📄 AiChatbot.tsx              # 24/7 AI medical assistant (Bengali + English)
│   │   ├── 📄 SymptomCheckerModal.tsx     # AI symptom triage modal
│   │   │
│   │   │  ── ⚙️ Settings & Booking ──
│   │   ├── 📄 AppointmentModal.tsx        # Doctor appointment booking modal
│   │   └── 📄 HospitalSettingsModal.tsx   # White-label hospital branding settings
│   │
│   ├── 📁 data/
│   │   └── hospitalData.ts               # Initial seed data (doctors, departments, beds)
│   │
│   ├── 📁 types/
│   │   ├── hospital.ts                   # Core TypeScript interfaces
│   │   └── patientModule.ts              # Patient module type definitions
│   │
│   ├── 📁 i18n/
│   │   └── translations.ts              # Bengali & English translations
│   │
│   └── 📁 services/
│       └── patientService.ts             # Patient API service layer
│
└── 📁 backend-java/                       # ═══ JAVA SPRING BOOT BACKEND ═══
    │
    ├── 📄 pom.xml                         # Maven dependencies (Spring Boot 3.2.x, Java 17+)
    ├── 📄 README.md                       # Java backend documentation
    │
    └── 📁 src/main/java/com/carepulse/hospital/
        │
        ├── 📄 HospitalManagementApplication.java  # Spring Boot main entry point
        │
        ├── 📁 config/
        │   └── WebMvcCorsConfig.java      # CORS configuration for frontend
        │
        ├── 📁 controller/                 # REST API Endpoints:
        │   ├── PatientController.java      #   → /api/patients
        │   ├── DoctorController.java       #   → /api/doctors
        │   ├── AppointmentController.java  #   → /api/appointments
        │   ├── BillingController.java      #   → /api/invoices
        │   ├── HospitalController.java     #   → /api/hospital
        │   └── AiChatController.java       #   → /api/ai/chat
        │
        ├── 📁 model/                      # Domain Entities:
        │   ├── Patient.java                #   → Patient profile
        │   ├── Doctor.java                 #   → Doctor details
        │   ├── Appointment.java            #   → Appointment booking
        │   ├── Invoice.java                #   → Billing invoice
        │   ├── InvoiceItem.java            #   → Invoice line items
        │   ├── BedCategory.java            #   → Bed management
        │   ├── HospitalSettings.java       #   → Hospital branding
        │   └── Medicine.java               #   → Prescription medicines
        │
        ├── 📁 dto/                        # Request/Response DTOs:
        │   ├── AppointmentRequest.java
        │   ├── PrescriptionRequest.java
        │   ├── PaymentUpdateRequest.java
        │   ├── AiChatRequest.java
        │   └── AiChatResponse.java
        │
        └── 📁 service/
            └── HospitalService.java        #   → Core business logic & in-memory store
```

---

## 🚀 Key Modules & Portals (প্রধান মডিউলসমূহ)

1. **🩺 Patient Health Portal & EMR Records**:
   - রোগীর সম্পূর্ণ প্রোফাইল (Blood Group, Allergies, Chronic Conditions, Emergency Contacts)
   - ডাক্তার ডিরেক্টরি এবং ডিপার্টমেন্ট ফিল্টারিং (Cardiology, Neurology, Pediatrics, Orthopedics)
   - সরাসরি অনলাইন অ্যাপয়েন্টমেন্ট বুকিং ও QR টোকেন জেনারেশন
   - ডায়াগনস্টিক ল্যাব টেস্ট রিপোর্ট প্রিভিউ ও ইনভয়েস হিস্ট্রি
   - এআই লক্ষণ পরীক্ষক (Symptom Checker)

2. **👨‍⚕️ Doctor OPD & Clinical Portal**:
   - রিয়েল-টাইম ডাক্তার কনসালটেশন কিউ ও শিডিউল ম্যানেজার
   - ডিজিটাল প্রেসক্রিপশন প্যাড (ওষুধের তালিকা, ডোজ ও পরামর্শ)
   - রোগীর পূর্ববর্তী মেডিকেল হিস্ট্রি ভিউয়ার

3. **🏢 Admin Super Control Command Center**:
   - এক্সিকিউটিভ ড্যাশবোর্ড (মোট আয়, বেড অকুপেন্সি, অন-ডিউটি ডাক্তার)
   - লাইভ বেড অকুপেন্সি কন্ট্রোলার (ICU, CCU, General, VIP Cabin)
   - ডাক্তার রোস্টার ও ফি শিডিউল ম্যানেজার

4. **💰 Dedicated Hospital Billing & POS Counter**:
   - ওপিডি, টেস্ট, বেড এবং ফার্মেসির আইটেমাইজড ইনভয়েস তৈরি
   - সাবটোটাল, ভ্যাট/ট্যাক্স, ডিসকাউন্ট অটোমেটিক ক্যালকুলেশন
   - পেমেন্ট মেথড (bKash, Nagad, Card, Cash) ও অফিশিয়াল রিসিপ্ট প্রিন্ট

5. **🚑 24/7 Emergency & Critical Care Center**:
   - লাইভ ICU/CCU খালি বেডের সংখ্যা প্রদর্শন
   - এক ক্লিকে জরুরি হটলাইন (`16263`) ও অ্যাম্বুলেন্স ডিসপ্যাচ কলিং
   - ব্লাড ব্যাংক স্টক ট্র্যাকার (O-, A+, B+, AB+)

6. **🤖 CarePulse AI Medical Assistant**:
   - ২৪/৭ বাংলা ও ইংরেজি ভাষায় এআই মেডিকেল সহকারী
   - প্রাথমিক লক্ষণ যাচাই করে উপযুক্ত স্পেশালিস্ট সুপারিশ

7. **👩‍⚕️ Nurse Portal**:
   - ওয়ার্ড ও শিফট ভিত্তিক রোগীর তালিকা ও ভাইটাল সাইন পর্যবেক্ষণ
   - SpO₂ ৯% এর নিচে নামলে স্বয়ংক্রিয় এস্কেলেশন অ্যালার্ট

8. **🖥️ Receptionist Front Desk Portal**:
   - নতুন রোগী নিবন্ধন ও অটোমেটিক Patient ID/MRN তৈরি
   - অ্যাপয়েন্টমেন্ট বুকিং, চেক-ইন, ওয়াক-ইন ও কিউ টোকেন পরিচালনা

9. **📊 Accountant & Billing Portal**:
   - কালেকশন, বকেয়া ইনভয়েস, ইন্স্যুরেন্স ক্লেইম ও খরচ ট্র্যাকিং
   - এক্সেল (CSV) ও PDF রিপোর্ট এক্সপোর্ট

10. **🔬 Laboratory Information System (LIS)**:
    - টেস্ট অর্ডার কিউ, বারকোড/QR সহ স্যাম্পল ট্র্যাকিং ও রিপোর্ট জেনারেশন

11. **💊 Pharmacy Management Portal**:
    - ওষুধের ব্যাচ ইনভেন্টরি, এক্সপায়ারি ট্র্যাকিং ও অটোমেটিক ডিসপেন্সিং

---

## 🛠️ How to Run Locally (কীভাবে আপনার কম্পিউটারে চালাবেন)

### ১. Frontend (React + Vite + Node/Express)

```bash
# ১. ডিপেনডেন্সি ইন্সটল করুন
npm install --legacy-peer-deps

# ২. এনভায়রনমেন্ট ফাইল সেটআপ করুন (ঐচ্ছিক Gemini AI কী-এর জন্য)
cp .env.example .env

# ৩. ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

ব্রাউজারে ওপেন করুন: **[http://localhost:3000](http://localhost:3000)**

---

### ২. Java Spring Boot Backend (ঐচ্ছিক — এন্টারপ্রাইজ API)

```bash
# Java backend ডিরেক্টরিতে যান
cd backend-java

# Maven দিয়ে রান করুন
mvn clean spring-boot:run
```

Java REST API রান হবে: **`http://localhost:8080`**

---

### ৩. Database Setup (ঐচ্ছিক)

সম্পূর্ণ রিলেশনাল স্কিমা `database/schema.sql` ফাইলে রয়েছে:

```bash
# PostgreSQL
psql -U postgres -d hospital_db -f database/schema.sql

# MySQL
mysql -u root -p hospital_db < database/schema.sql
```

---

## 🔒 License & Copyright

Developed by **Kowshik Roy** for CarePulse Hospital & Medical Center.  
All rights reserved.
