export type PatientGender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type AppointmentStatusType = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type BillPaymentStatusType = 'Paid' | 'Pending';

export interface PatientAccount {
  patient_id: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  phone: string;
  dob: string; // YYYY-MM-DD
  gender: PatientGender;
  blood_group: BloodGroup;
  address: string;
  avatar_url?: string;
  created_at?: string;
}

export interface DoctorItem {
  doctor_id: string;
  name: string;
  specialization: string;
  experience_years: number;
  available_time: string;
  consultation_fee: number;
  room_no?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  rating?: number;
}

export interface AppointmentRecord {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  specialization: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string;
  status: AppointmentStatusType;
  symptoms?: string;
  consultation_fee?: number;
  created_at?: string;
}

export interface MedicalRecordItem {
  record_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  diagnosis: string;
  treatment: string;
  doctor_notes?: string;
  date: string; // YYYY-MM-DD
}

export interface PrescriptionRecord {
  prescription_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
  prescription_date: string; // YYYY-MM-DD
}

export interface BillingRecord {
  bill_id: string;
  invoice_number: string;
  patient_id: string;
  doctor_consultation_fee: number;
  test_fee: number;
  medicine_cost: number;
  amount: number;
  payment_status: BillPaymentStatusType;
  payment_method?: string;
  transaction_id?: string;
  date: string; // YYYY-MM-DD
}

export interface TestReportRecord {
  report_id: string;
  patient_id: string;
  test_name: string;
  doctor_recommendation: string;
  test_date: string;
  status: 'Completed' | 'In Progress';
  result_summary: string;
  file_name?: string;
}

export interface SymptomCheckerRecord {
  checker_id: string;
  patient_id: string;
  symptoms: string;
  duration: string;
  severity: string;
  existing_diseases?: string;
  allergies?: string;
  analysis_result: string;
  recommended_department: string;
  urgency_level: 'Emergency' | 'Priority' | 'Normal';
  created_date: string; // YYYY-MM-DD
}

export type PatientSidebarTab =
  | 'dashboard'
  | 'profile'
  | 'find_doctor'
  | 'book_appointment'
  | 'appointments'
  | 'medical_history'
  | 'prescriptions'
  | 'test_reports'
  | 'billing'
  | 'symptom_checker'
  | 'logout';
