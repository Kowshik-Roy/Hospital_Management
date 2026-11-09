<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\Prescription;
use App\Models\Billing;
use App\Models\TestReport;
use App\Models\SymptomChecker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Doctors
        $doctors = [
            [
                'doctor_id' => 'DOC-101',
                'name' => 'Dr. Ahmed Rahman',
                'specialization' => 'Cardiologist',
                'experience_years' => 10,
                'available_time' => '10 AM - 2 PM',
                'consultation_fee' => 1200.00,
                'room_no' => 'Room 302, 3rd Floor',
                'avatar_url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
                'phone' => '+880 1711-200301',
                'email' => 'ahmed.rahman@carepulse.hospital',
                'rating' => 4.9,
            ],
            [
                'doctor_id' => 'DOC-102',
                'name' => 'Dr. Fatima Begum',
                'specialization' => 'Neurologist',
                'experience_years' => 12,
                'available_time' => '11 AM - 3 PM',
                'consultation_fee' => 1500.00,
                'room_no' => 'Room 405, 4th Floor',
                'avatar_url' => 'https://images.unsplash.com/photo-1594824813575-58e1c64eb3e5?w=300&auto=format&fit=crop&q=80',
                'phone' => '+880 1711-200302',
                'email' => 'fatima.begum@carepulse.hospital',
                'rating' => 4.8,
            ],
            [
                'doctor_id' => 'DOC-103',
                'name' => 'Dr. Kamal Hossain',
                'specialization' => 'Orthopedic Surgeon',
                'experience_years' => 8,
                'available_time' => '4 PM - 8 PM',
                'consultation_fee' => 1000.00,
                'room_no' => 'Room 201, 2nd Floor',
                'avatar_url' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
                'phone' => '+880 1711-200303',
                'email' => 'kamal.hossain@carepulse.hospital',
                'rating' => 4.7,
            ],
            [
                'doctor_id' => 'DOC-104',
                'name' => 'Dr. Nusrat Jahan',
                'specialization' => 'Pediatrician',
                'experience_years' => 7,
                'available_time' => '9 AM - 1 PM',
                'consultation_fee' => 900.00,
                'room_no' => 'Room 108, 1st Floor',
                'avatar_url' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
                'phone' => '+880 1711-200304',
                'email' => 'nusrat.jahan@carepulse.hospital',
                'rating' => 4.9,
            ],
            [
                'doctor_id' => 'DOC-105',
                'name' => 'Dr. Mahmud Hasan',
                'specialization' => 'General Medicine',
                'experience_years' => 15,
                'available_time' => '2 PM - 6 PM',
                'consultation_fee' => 800.00,
                'room_no' => 'Room 102, 1st Floor',
                'avatar_url' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
                'phone' => '+880 1711-200305',
                'email' => 'mahmud.hasan@carepulse.hospital',
                'rating' => 4.8,
            ],
        ];

        foreach ($doctors as $doc) {
            Doctor::updateOrCreate(['doctor_id' => $doc['doctor_id']], $doc);
        }

        // 2. Seed Default Demo Patient
        // Password hash for 'Patient@123'
        $patient = Patient::updateOrCreate(
            ['patient_id' => 'PAT-1001'],
            [
                'name' => 'Rahim Uddin',
                'email' => 'rahim@carepulse.hospital',
                'password' => hash('sha256', 'Patient@123'),
                'phone' => '01712-345678',
                'dob' => '1990-05-15',
                'gender' => 'Male',
                'blood_group' => 'O+',
                'address' => 'House #42, Road #7, Dhanmondi, Dhaka',
                'avatar_url' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            ]
        );

        // 3. Seed Appointments
        $appointments = [
            [
                'appointment_id' => 'APT-2026-001',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-101',
                'doctor_name' => 'Dr. Ahmed Rahman',
                'specialization' => 'Cardiologist',
                'appointment_date' => date('Y-m-d', strtotime('+2 days')),
                'appointment_time' => '10:30 AM',
                'status' => 'Confirmed',
                'symptoms' => 'Chest discomfort and shortness of breath after mild exertion',
                'consultation_fee' => 1200.00,
            ],
            [
                'appointment_id' => 'APT-2026-002',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-105',
                'doctor_name' => 'Dr. Mahmud Hasan',
                'specialization' => 'General Medicine',
                'appointment_date' => date('Y-m-d', strtotime('-10 days')),
                'appointment_time' => '03:00 PM',
                'status' => 'Completed',
                'symptoms' => 'Routine post-flu checkup and general weakness',
                'consultation_fee' => 800.00,
            ],
            [
                'appointment_id' => 'APT-2026-003',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-103',
                'doctor_name' => 'Dr. Kamal Hossain',
                'specialization' => 'Orthopedic Surgeon',
                'appointment_date' => date('Y-m-d', strtotime('+5 days')),
                'appointment_time' => '05:00 PM',
                'status' => 'Pending',
                'symptoms' => 'Knee joint pain after morning jogging',
                'consultation_fee' => 1000.00,
            ],
        ];

        foreach ($appointments as $apt) {
            Appointment::updateOrCreate(['appointment_id' => $apt['appointment_id']], $apt);
        }

        // 4. Seed Medical Records
        $medicalRecords = [
            [
                'record_id' => 'MED-501',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-105',
                'doctor_name' => 'Dr. Mahmud Hasan',
                'diagnosis' => 'Mild Upper Respiratory Infection',
                'treatment' => 'Rest, oral hydration, Acetaminophen 500mg, and Antihistamines',
                'doctor_notes' => 'Patient is recovering well. Chest clear on auscultation. Advised to avoid cold fluids.',
                'date' => date('Y-m-d', strtotime('-10 days')),
            ],
            [
                'record_id' => 'MED-502',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-101',
                'doctor_name' => 'Dr. Ahmed Rahman',
                'diagnosis' => 'Pre-Hypertension & Mild Tachycardia',
                'treatment' => 'Lifestyle modification, low sodium intake, 30 min daily walking, Tab Bisoprolol 2.5mg',
                'doctor_notes' => 'Resting blood pressure 138/88 mmHg. Advised 2D Echocardiogram and Lipid Profile test.',
                'date' => date('Y-m-d', strtotime('-35 days')),
            ],
        ];

        foreach ($medicalRecords as $mr) {
            MedicalRecord::updateOrCreate(['record_id' => $mr['record_id']], $mr);
        }

        // 5. Seed Prescriptions
        $prescriptions = [
            [
                'prescription_id' => 'RX-801',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-101',
                'doctor_name' => 'Dr. Ahmed Rahman',
                'medicine' => 'Tab. Bisoprolol Fumarate 2.5mg',
                'dosage' => '1 tablet daily',
                'duration' => '30 days',
                'instructions' => 'Take in the morning with a full glass of water after breakfast',
                'prescription_date' => date('Y-m-d', strtotime('-2 days')),
            ],
            [
                'prescription_id' => 'RX-802',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-101',
                'doctor_name' => 'Dr. Ahmed Rahman',
                'medicine' => 'Tab. Rosuvastatin 10mg',
                'dosage' => '1 tablet at bedtime',
                'duration' => '60 days',
                'instructions' => 'Take at night after food. Avoid grapefruit juice.',
                'prescription_date' => date('Y-m-d', strtotime('-2 days')),
            ],
            [
                'prescription_id' => 'RX-803',
                'patient_id' => 'PAT-1001',
                'doctor_id' => 'DOC-105',
                'doctor_name' => 'Dr. Mahmud Hasan',
                'medicine' => 'Tab. Paracetamol 500mg',
                'dosage' => '1 tablet as needed (max 3/day)',
                'duration' => '5 days',
                'instructions' => 'Take only when fever exceeds 100°F or body ache persists',
                'prescription_date' => date('Y-m-d', strtotime('-10 days')),
            ],
        ];

        foreach ($prescriptions as $rx) {
            Prescription::updateOrCreate(['prescription_id' => $rx['prescription_id']], $rx);
        }

        // 6. Seed Billings
        $billings = [
            [
                'bill_id' => 'BIL-901',
                'invoice_number' => 'INV-2026-001',
                'patient_id' => 'PAT-1001',
                'doctor_consultation_fee' => 1200.00,
                'test_fee' => 3500.00,
                'medicine_cost' => 850.00,
                'amount' => 5550.00,
                'payment_status' => 'Pending',
                'payment_method' => null,
                'transaction_id' => null,
                'date' => date('Y-m-d', strtotime('-2 days')),
            ],
            [
                'bill_id' => 'BIL-902',
                'invoice_number' => 'INV-2026-002',
                'patient_id' => 'PAT-1001',
                'doctor_consultation_fee' => 800.00,
                'test_fee' => 0.00,
                'medicine_cost' => 320.00,
                'amount' => 1120.00,
                'payment_status' => 'Paid',
                'payment_method' => 'bKash Online',
                'transaction_id' => 'TXN-BK982143',
                'date' => date('Y-m-d', strtotime('-10 days')),
            ],
            [
                'bill_id' => 'BIL-903',
                'invoice_number' => 'INV-2026-003',
                'patient_id' => 'PAT-1001',
                'doctor_consultation_fee' => 1200.00,
                'test_fee' => 1800.00,
                'medicine_cost' => 0.00,
                'amount' => 3000.00,
                'payment_status' => 'Paid',
                'payment_method' => 'Credit Card',
                'transaction_id' => 'TXN-CC449102',
                'date' => date('Y-m-d', strtotime('-35 days')),
            ],
        ];

        foreach ($billings as $bill) {
            Billing::updateOrCreate(['bill_id' => $bill['bill_id']], $bill);
        }

        // 7. Seed Test Reports
        $testReports = [
            [
                'report_id' => 'RPT-701',
                'patient_id' => 'PAT-1001',
                'test_name' => 'Comprehensive Lipid Profile',
                'doctor_recommendation' => 'Recommended by Dr. Ahmed Rahman for cardiovascular risk assessment',
                'test_date' => date('Y-m-d', strtotime('-3 days')),
                'status' => 'Completed',
                'result_summary' => 'Total Cholesterol: 185 mg/dL (Normal < 200), HDL: 48 mg/dL, LDL: 112 mg/dL, Triglycerides: 145 mg/dL.',
                'file_name' => 'lipid_profile_report_701.pdf',
            ],
            [
                'report_id' => 'RPT-702',
                'patient_id' => 'PAT-1001',
                'test_name' => '12-Lead Electrocardiogram (ECG)',
                'doctor_recommendation' => 'Recommended by Dr. Ahmed Rahman for palpitation check',
                'test_date' => date('Y-m-d', strtotime('-3 days')),
                'status' => 'Completed',
                'result_summary' => 'Normal Sinus Rhythm. Heart rate 72 bpm. No acute ST-T elevation or pathological Q-waves observed.',
                'file_name' => 'ecg_trace_report_702.pdf',
            ],
            [
                'report_id' => 'RPT-703',
                'patient_id' => 'PAT-1001',
                'test_name' => 'Complete Blood Count (CBC) with ESR',
                'doctor_recommendation' => 'Recommended by Dr. Mahmud Hasan for general wellness',
                'test_date' => date('Y-m-d', strtotime('-11 days')),
                'status' => 'Completed',
                'result_summary' => 'Hemoglobin: 14.2 g/dL (Normal). WBC: 6,800 /uL. Platelets: 245,000 /uL. ESR: 12 mm/hr.',
                'file_name' => 'cbc_routine_report_703.pdf',
            ],
        ];

        foreach ($testReports as $tr) {
            TestReport::updateOrCreate(['report_id' => $tr['report_id']], $tr);
        }

        // 8. Seed Symptom Checker
        $symptomChecks = [
            [
                'checker_id' => 'CHK-001',
                'patient_id' => 'PAT-1001',
                'symptoms' => 'Fever, Cough, Body Pain, Fatigue',
                'duration' => '4–7 days',
                'severity' => 'moderate',
                'existing_diseases' => 'Hypertension',
                'allergies' => 'None',
                'analysis_result' => 'Respiratory Infection (Possible Flu / Pneumonia)',
                'recommended_department' => 'Medicine (General)',
                'urgency_level' => 'Priority',
                'created_date' => date('Y-m-d', strtotime('-5 days')),
            ],
            [
                'checker_id' => 'CHK-002',
                'patient_id' => 'PAT-1001',
                'symptoms' => 'Headache, Dizziness',
                'duration' => '1–3 days',
                'severity' => 'mild',
                'existing_diseases' => 'None',
                'allergies' => 'None',
                'analysis_result' => 'Neurological / Tension-Related Condition',
                'recommended_department' => 'Neurology / Medicine',
                'urgency_level' => 'Normal',
                'created_date' => date('Y-m-d', strtotime('-12 days')),
            ],
            [
                'checker_id' => 'CHK-003',
                'patient_id' => 'PAT-1001',
                'symptoms' => 'Stomach Pain, Vomiting / Nausea',
                'duration' => 'Less than 24 hours',
                'severity' => 'moderate',
                'existing_diseases' => 'None',
                'allergies' => 'Penicillin',
                'analysis_result' => 'Gastrointestinal Disorder',
                'recommended_department' => 'Gastroenterology / Medicine',
                'urgency_level' => 'Normal',
                'created_date' => date('Y-m-d', strtotime('-20 days')),
            ],
        ];

        foreach ($symptomChecks as $sc) {
            SymptomChecker::updateOrCreate(['checker_id' => $sc['checker_id']], $sc);
        }
    }
}
