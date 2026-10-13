-- ==========================================================
-- Hospital Management System - Database Design
-- Patient Role Module Schema
-- Technology: PostgreSQL / MySQL / SQL Server Compatible
-- ==========================================================

-- 1. Patient Table
CREATE TABLE IF NOT EXISTS Patient (
    patient_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(10) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    address TEXT NOT NULL,
    avatar_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patient_email ON Patient(email);
CREATE INDEX IF NOT EXISTS idx_patient_phone ON Patient(phone);

-- 2. Doctor Table (Reference for appointments & prescriptions)
CREATE TABLE IF NOT EXISTS Doctor (
    doctor_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL,
    available_time VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    room_no VARCHAR(50) DEFAULT 'Room 101',
    avatar_url TEXT DEFAULT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL
);

-- 3. Appointment Table
CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    symptoms TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_appointment_patient ON Appointment(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointment_doctor ON Appointment(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointment_date ON Appointment(appointment_date);

-- 4. Medical_Record Table
CREATE TABLE IF NOT EXISTS Medical_Record (
    record_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT NOT NULL,
    doctor_notes TEXT DEFAULT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_medical_record_patient ON Medical_Record(patient_id);

-- 5. Prescription Table
CREATE TABLE IF NOT EXISTS Prescription (
    prescription_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    medicine VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT NOT NULL,
    prescription_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prescription_patient ON Prescription(patient_id);

-- 6. Billing Table
CREATE TABLE IF NOT EXISTS Billing (
    bill_id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id VARCHAR(50) NOT NULL,
    doctor_consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    test_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    medicine_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending')),
    payment_method VARCHAR(50) DEFAULT NULL,
    transaction_id VARCHAR(100) DEFAULT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_billing_patient ON Billing(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_status ON Billing(payment_status);

-- 7. Test_Report Table
CREATE TABLE IF NOT EXISTS Test_Report (
    report_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    doctor_recommendation TEXT NOT NULL,
    test_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Completed',
    result_summary TEXT NOT NULL,
    file_name VARCHAR(255) DEFAULT 'diagnostic_report.pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_test_report_patient ON Test_Report(patient_id);

-- ==========================================================
-- Sample Seed Data
-- ==========================================================

-- Insert Default Doctors
INSERT INTO Doctor (doctor_id, name, specialization, experience_years, available_time, consultation_fee, room_no, avatar_url)
VALUES 
('DOC-101', 'Dr. Ahmed Rahman', 'Cardiologist', 10, '10 AM - 2 PM', 1200.00, 'Room 302, 3rd Floor', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'),
('DOC-102', 'Dr. Fatima Begum', 'Neurologist', 12, '11 AM - 3 PM', 1500.00, 'Room 405, 4th Floor', 'https://images.unsplash.com/photo-1594824813575-58e1c64eb3e5?w=300&auto=format&fit=crop&q=80'),
('DOC-103', 'Dr. Kamal Hossain', 'Orthopedic Surgeon', 8, '4 PM - 8 PM', 1000.00, 'Room 201, 2nd Floor', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80'),
('DOC-104', 'Dr. Nusrat Jahan', 'Pediatrician', 7, '9 AM - 1 PM', 900.00, 'Room 108, 1st Floor', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80'),
('DOC-105', 'Dr. Mahmud Hasan', 'General Medicine', 15, '2 PM - 6 PM', 800.00, 'Room 102, 1st Floor', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80')
ON CONFLICT (doctor_id) DO NOTHING;

-- Insert Default Demo Patient (Password: Patient@123, SHA-256 hashed)
INSERT INTO Patient (patient_id, name, email, password, phone, dob, gender, blood_group, address, avatar_url)
VALUES 
('PAT-1001', 'Rahim Uddin', 'rahim@carepulse.hospital', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '01712-345678', '1990-05-15', 'Male', 'O+', 'House #42, Road #7, Dhanmondi, Dhaka', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80')
ON CONFLICT (patient_id) DO NOTHING;

-- Insert Appointments
INSERT INTO Appointment (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, status, symptoms)
VALUES 
('APT-2026-001', 'PAT-1001', 'DOC-101', CURRENT_DATE + INTERVAL '2 day', '10:30 AM', 'Confirmed', 'Chest discomfort and shortness of breath after mild exertion'),
('APT-2026-002', 'PAT-1001', 'DOC-105', CURRENT_DATE - INTERVAL '10 day', '03:00 PM', 'Completed', 'Routine post-flu checkup and general weakness'),
('APT-2026-003', 'PAT-1001', 'DOC-103', CURRENT_DATE + INTERVAL '5 day', '05:00 PM', 'Pending', 'Knee joint pain after morning jogging')
ON CONFLICT (appointment_id) DO NOTHING;

-- Insert Medical Records
INSERT INTO Medical_Record (record_id, patient_id, doctor_id, diagnosis, treatment, doctor_notes, date)
VALUES 
('MED-501', 'PAT-1001', 'DOC-105', 'Mild Upper Respiratory Infection', 'Rest, oral hydration, Acetaminophen 500mg, and Antihistamines', 'Patient is recovering well. Chest clear on auscultation. Advised to avoid cold fluids.', CURRENT_DATE - INTERVAL '10 day'),
('MED-502', 'PAT-1001', 'DOC-101', 'Pre-Hypertension & Mild Tachycardia', 'Lifestyle modification, low sodium intake, 30 min daily walking, Tab Bisoprolol 2.5mg', 'Resting blood pressure 138/88 mmHg. Advised 2D Echocardiogram and Lipid Profile test.', CURRENT_DATE - INTERVAL '35 day')
ON CONFLICT (record_id) DO NOTHING;

-- Insert Prescriptions
INSERT INTO Prescription (prescription_id, patient_id, doctor_id, medicine, dosage, duration, instructions, prescription_date)
VALUES 
('RX-801', 'PAT-1001', 'DOC-101', 'Tab. Bisoprolol Fumarate 2.5mg', '1 tablet daily', '30 days', 'Take in the morning with a full glass of water after breakfast', CURRENT_DATE - INTERVAL '2 day'),
('RX-802', 'PAT-1001', 'DOC-101', 'Tab. Rosuvastatin 10mg', '1 tablet at bedtime', '60 days', 'Take at night after food. Avoid grapefruit juice.', CURRENT_DATE - INTERVAL '2 day'),
('RX-803', 'PAT-1001', 'DOC-105', 'Tab. Paracetamol 500mg', '1 tablet as needed (max 3/day)', '5 days', 'Take only when fever exceeds 100°F or body ache persists', CURRENT_DATE - INTERVAL '10 day')
ON CONFLICT (prescription_id) DO NOTHING;

-- Insert Billings
INSERT INTO Billing (bill_id, invoice_number, patient_id, doctor_consultation_fee, test_fee, medicine_cost, amount, payment_status, payment_method, transaction_id, date)
VALUES 
('BIL-901', 'INV-2026-001', 'PAT-1001', 1200.00, 3500.00, 850.00, 5550.00, 'Pending', NULL, NULL, CURRENT_DATE - INTERVAL '2 day'),
('BIL-902', 'INV-2026-002', 'PAT-1001', 800.00, 0.00, 320.00, 1120.00, 'Paid', 'bKash Online', 'TXN-BK982143', CURRENT_DATE - INTERVAL '10 day'),
('BIL-903', 'INV-2026-003', 'PAT-1001', 1200.00, 1800.00, 0.00, 3000.00, 'Paid', 'Credit Card', 'TXN-CC449102', CURRENT_DATE - INTERVAL '35 day')
ON CONFLICT (bill_id) DO NOTHING;

-- Insert Test Reports
INSERT INTO Test_Report (report_id, patient_id, test_name, doctor_recommendation, test_date, status, result_summary, file_name)
VALUES 
('RPT-701', 'PAT-1001', 'Comprehensive Lipid Profile', 'Recommended by Dr. Ahmed Rahman for cardiovascular risk assessment', CURRENT_DATE - INTERVAL '3 day', 'Completed', 'Total Cholesterol: 185 mg/dL (Normal < 200), HDL: 48 mg/dL, LDL: 112 mg/dL, Triglycerides: 145 mg/dL.', 'lipid_profile_report_701.pdf'),
('RPT-702', 'PAT-1001', '12-Lead Electrocardiogram (ECG)', 'Recommended by Dr. Ahmed Rahman for palpitation check', CURRENT_DATE - INTERVAL '3 day', 'Completed', 'Normal Sinus Rhythm. Heart rate 72 bpm. No acute ST-T elevation or pathological Q-waves observed.', 'ecg_trace_report_702.pdf'),
('RPT-703', 'PAT-1001', 'Complete Blood Count (CBC) with ESR', 'Recommended by Dr. Mahmud Hasan for general wellness', CURRENT_DATE - INTERVAL '11 day', 'Completed', 'Hemoglobin: 14.2 g/dL (Normal). WBC: 6,800 /uL. Platelets: 245,000 /uL. ESR: 12 mm/hr.', 'cbc_routine_report_703.pdf')
ON CONFLICT (report_id) DO NOTHING;

-- ============================================================
-- 7. Symptom Checker Table (AI-Powered Symptom Analysis Log)
-- ============================================================
CREATE TABLE IF NOT EXISTS Symptom_Checker (
    checker_id      VARCHAR(50)  PRIMARY KEY,
    patient_id      VARCHAR(50)  NOT NULL,
    symptoms        TEXT         NOT NULL,
    duration        VARCHAR(100) NOT NULL DEFAULT 'Not specified',
    severity        VARCHAR(50)  NOT NULL DEFAULT 'Not specified',
    existing_diseases TEXT        DEFAULT NULL,
    allergies       TEXT         DEFAULT NULL,
    analysis_result TEXT         NOT NULL,
    recommended_department VARCHAR(150) NOT NULL,
    urgency_level   VARCHAR(20)  NOT NULL
                       CHECK (urgency_level IN ('Emergency', 'Priority', 'Normal')),
    created_date    DATE         NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_symptom_checker_patient
        FOREIGN KEY (patient_id)
        REFERENCES Patient(patient_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_symptom_checker_patient ON Symptom_Checker(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_checker_date    ON Symptom_Checker(created_date);
CREATE INDEX IF NOT EXISTS idx_symptom_checker_urgency ON Symptom_Checker(urgency_level);

-- Sample Symptom Check Records for Development/Testing
INSERT INTO Symptom_Checker
    (checker_id, patient_id, symptoms, duration, severity, existing_diseases, allergies,
     analysis_result, recommended_department, urgency_level, created_date)
VALUES
(
    'CHK-001',
    'PAT-1001',
    'Fever, Cough, Body Pain, Fatigue',
    '4–7 days',
    'moderate',
    'Hypertension',
    'None',
    'Respiratory Infection (Possible Flu / Pneumonia)',
    'Medicine (General)',
    'Priority',
    CURRENT_DATE - INTERVAL '5 day'
),
(
    'CHK-002',
    'PAT-1001',
    'Headache, Dizziness',
    '1–3 days',
    'mild',
    'None',
    'None',
    'Neurological / Tension-Related Condition',
    'Neurology / Medicine',
    'Normal',
    CURRENT_DATE - INTERVAL '12 day'
),
(
    'CHK-003',
    'PAT-1001',
    'Stomach Pain, Vomiting / Nausea',
    'Less than 24 hours',
    'moderate',
    'None',
    'Penicillin',
    'Gastrointestinal Disorder',
    'Gastroenterology / Medicine',
    'Normal',
    CURRENT_DATE - INTERVAL '20 day'
)
ON CONFLICT (checker_id) DO NOTHING;
