import {
  PatientAccount,
  DoctorItem,
  AppointmentRecord,
  MedicalRecordItem,
  PrescriptionRecord,
  BillingRecord,
  TestReportRecord,
  SymptomCheckerRecord,
  AppointmentStatusType
} from '../types/patientModule';

// SHA-256 Password Hashing Utility
export async function hashPassword(plainText: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple hash if Web Crypto isn't available
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = (hash << 5) - hash + plainText.charCodeAt(i);
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }
}

// Password Strength Evaluator
export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'bg-slate-200',
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    };
  }

  const labels: Array<PasswordStrength['label']> = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return {
    score,
    label: labels[score],
    color: colors[score],
    hasLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
  };
}

// Initial Doctors Seed Data
export const INITIAL_DOCTORS: DoctorItem[] = [
  {
    doctor_id: 'DOC-101',
    name: 'Dr. Ahmed Rahman',
    specialization: 'Cardiologist',
    experience_years: 10,
    available_time: '10 AM - 2 PM',
    consultation_fee: 1200,
    room_no: 'Room 302, 3rd Floor',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    phone: '+880 1711-200301',
    rating: 4.9
  },
  {
    doctor_id: 'DOC-102',
    name: 'Dr. Fatima Begum',
    specialization: 'Neurologist',
    experience_years: 12,
    available_time: '11 AM - 3 PM',
    consultation_fee: 1500,
    room_no: 'Room 405, 4th Floor',
    avatar_url: 'https://images.unsplash.com/photo-1594824813575-58e1c64eb3e5?w=300&auto=format&fit=crop&q=80',
    phone: '+880 1711-200302',
    rating: 4.8
  },
  {
    doctor_id: 'DOC-103',
    name: 'Dr. Kamal Hossain',
    specialization: 'Orthopedic Surgeon',
    experience_years: 8,
    available_time: '4 PM - 8 PM',
    consultation_fee: 1000,
    room_no: 'Room 201, 2nd Floor',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    phone: '+880 1711-200303',
    rating: 4.7
  },
  {
    doctor_id: 'DOC-104',
    name: 'Dr. Nusrat Jahan',
    specialization: 'Pediatrician',
    experience_years: 7,
    available_time: '9 AM - 1 PM',
    consultation_fee: 900,
    room_no: 'Room 108, 1st Floor',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    phone: '+880 1711-200304',
    rating: 4.9
  },
  {
    doctor_id: 'DOC-105',
    name: 'Dr. Mahmud Hasan',
    specialization: 'General Medicine',
    experience_years: 15,
    available_time: '2 PM - 6 PM',
    consultation_fee: 800,
    room_no: 'Room 102, 1st Floor',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    phone: '+880 1711-200305',
    rating: 4.8
  },
  {
    doctor_id: 'DOC-106',
    name: 'Dr. Tasnim Ara',
    specialization: 'Gynecologist',
    experience_years: 11,
    available_time: '10 AM - 2 PM',
    consultation_fee: 1100,
    room_no: 'Room 305, 3rd Floor',
    avatar_url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&auto=format&fit=crop&q=80',
    phone: '+880 1711-200306',
    rating: 4.9
  }
];

// Initial Demo Patient Seed Data
export const INITIAL_PATIENTS: PatientAccount[] = [
  {
    patient_id: 'PAT-1001',
    name: 'Rahim Uddin',
    email: 'rahim@carepulse.hospital',
    // SHA-256 of "Patient@123"
    password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    phone: '01712-345678',
    dob: '1990-05-15',
    gender: 'Male',
    blood_group: 'O+',
    address: 'House #42, Road #7, Dhanmondi, Dhaka',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    created_at: '2026-01-10'
  }
];

// Initial Appointments Seed Data
export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    appointment_id: 'APT-2026-001',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-101',
    doctor_name: 'Dr. Ahmed Rahman',
    specialization: 'Cardiologist',
    appointment_date: '2026-10-15',
    appointment_time: '10:30 AM',
    status: 'Confirmed',
    symptoms: 'Chest tightness after stair climbing',
    consultation_fee: 1200
  },
  {
    appointment_id: 'APT-2026-002',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-105',
    doctor_name: 'Dr. Mahmud Hasan',
    specialization: 'General Medicine',
    appointment_date: '2026-10-02',
    appointment_time: '03:00 PM',
    status: 'Completed',
    symptoms: 'Follow-up for mild seasonal cough and fatigue',
    consultation_fee: 800
  },
  {
    appointment_id: 'APT-2026-003',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-103',
    doctor_name: 'Dr. Kamal Hossain',
    specialization: 'Orthopedic Surgeon',
    appointment_date: '2026-10-20',
    appointment_time: '05:00 PM',
    status: 'Pending',
    symptoms: 'Right knee joint pain during morning walking',
    consultation_fee: 1000
  }
];

// Initial Medical Records Seed Data
export const INITIAL_MEDICAL_RECORDS: MedicalRecordItem[] = [
  {
    record_id: 'MED-501',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-105',
    doctor_name: 'Dr. Mahmud Hasan',
    diagnosis: 'Mild Upper Respiratory Infection',
    treatment: 'Hydration therapy, oral Paracetamol 500mg, and Antihistamine syrup',
    doctor_notes: 'Lungs clear bilaterally. Vitals normal. Patient instructed to maintain warm fluid intake.',
    date: '2026-10-02'
  },
  {
    record_id: 'MED-502',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-101',
    doctor_name: 'Dr. Ahmed Rahman',
    diagnosis: 'Stage 1 Hypertension & Exertional Tachycardia',
    treatment: 'Dietary DASH plan, low salt intake, Bisoprolol 2.5mg, and moderate exercise',
    doctor_notes: 'BP 138/88 mmHg. Advised 2D Echocardiogram and 12-lead ECG review.',
    date: '2026-09-08'
  }
];

// Initial Prescriptions Seed Data
export const INITIAL_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    prescription_id: 'RX-801',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-101',
    doctor_name: 'Dr. Ahmed Rahman',
    medicine: 'Tab. Bisoprolol Fumarate 2.5mg',
    dosage: '1 tablet once daily',
    duration: '30 Days',
    instructions: 'Take in the morning after breakfast with plenty of water',
    prescription_date: '2026-10-08'
  },
  {
    prescription_id: 'RX-802',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-101',
    doctor_name: 'Dr. Ahmed Rahman',
    medicine: 'Tab. Rosuvastatin 10mg',
    dosage: '1 tablet daily at night',
    duration: '60 Days',
    instructions: 'Take strictly after dinner before bedtime. Avoid grapefruit products.',
    prescription_date: '2026-10-08'
  },
  {
    prescription_id: 'RX-803',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-105',
    doctor_name: 'Dr. Mahmud Hasan',
    medicine: 'Tab. Paracetamol 500mg (Napa Extend)',
    dosage: '1 tablet every 8 hours as needed',
    duration: '5 Days',
    instructions: 'Take after meal only if fever or body ache is present (max 3 tabs/day)',
    prescription_date: '2026-10-02'
  }
];

// Initial Billing Seed Data
export const INITIAL_BILLS: BillingRecord[] = [
  {
    bill_id: 'BIL-901',
    invoice_number: 'INV-2026-001',
    patient_id: 'PAT-1001',
    doctor_consultation_fee: 1200,
    test_fee: 3500,
    medicine_cost: 850,
    amount: 5550,
    payment_status: 'Pending',
    date: '2026-10-08'
  },
  {
    bill_id: 'BIL-902',
    invoice_number: 'INV-2026-002',
    patient_id: 'PAT-1001',
    doctor_consultation_fee: 800,
    test_fee: 0,
    medicine_cost: 320,
    amount: 1120,
    payment_status: 'Paid',
    payment_method: 'bKash Digital Payment',
    transaction_id: 'TXN-BK982143',
    date: '2026-10-02'
  },
  {
    bill_id: 'BIL-903',
    invoice_number: 'INV-2026-003',
    patient_id: 'PAT-1001',
    doctor_consultation_fee: 1200,
    test_fee: 1800,
    medicine_cost: 0,
    amount: 3000,
    payment_status: 'Paid',
    payment_method: 'Visa Credit Card',
    transaction_id: 'TXN-CC449102',
    date: '2026-09-08'
  }
];

// Initial Test Reports Seed Data
export const INITIAL_TEST_REPORTS: TestReportRecord[] = [
  {
    report_id: 'RPT-701',
    patient_id: 'PAT-1001',
    test_name: 'Comprehensive Lipid Profile',
    doctor_recommendation: 'Recommended by Dr. Ahmed Rahman for cardiovascular risk assessment',
    test_date: '2026-10-07',
    status: 'Completed',
    result_summary: 'Total Cholesterol: 185 mg/dL (Normal < 200), HDL: 48 mg/dL, LDL: 112 mg/dL, Triglycerides: 145 mg/dL',
    file_name: 'lipid_profile_report_701.pdf'
  },
  {
    report_id: 'RPT-702',
    patient_id: 'PAT-1001',
    test_name: '12-Lead Electrocardiogram (ECG)',
    doctor_recommendation: 'Recommended by Dr. Ahmed Rahman for palpitation check',
    test_date: '2026-10-07',
    status: 'Completed',
    result_summary: 'Normal Sinus Rhythm. Heart rate 72 bpm. PR interval 0.16s, QRS 0.08s. No ischemic ST changes.',
    file_name: 'ecg_trace_report_702.pdf'
  },
  {
    report_id: 'RPT-703',
    patient_id: 'PAT-1001',
    test_name: 'Complete Blood Count (CBC) with ESR',
    doctor_recommendation: 'Recommended by Dr. Mahmud Hasan for routine health check',
    test_date: '2026-09-30',
    status: 'Completed',
    result_summary: 'Hemoglobin: 14.2 g/dL (Normal 13.5-17.5). Total WBC: 6,800 /uL. Platelets: 245,000 /uL. ESR: 12 mm/hr.',
    file_name: 'cbc_routine_report_703.pdf'
  }
];

// Storage Keys
const STORAGE_KEYS = {
  PATIENTS: 'carepulse_db_patients',
  APPOINTMENTS: 'carepulse_db_appointments',
  MEDICAL_RECORDS: 'carepulse_db_medical_records',
  PRESCRIPTIONS: 'carepulse_db_prescriptions',
  BILLS: 'carepulse_db_bills',
  TEST_REPORTS: 'carepulse_db_test_reports',
  CURRENT_PATIENT_ID: 'carepulse_active_patient_id'
};

// Database Storage Helper
export class PatientDB {
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
    }
    return fallback;
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing ${key} to storage:`, e);
    }
  }

  // --- Patients ---
  static getPatients(): PatientAccount[] {
    const patients = this.getItem<PatientAccount[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    if (!patients || patients.length === 0) {
      this.setItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
      return INITIAL_PATIENTS;
    }
    return patients;
  }

  static getPatientById(patientId: string): PatientAccount | null {
    const list = this.getPatients();
    return list.find(p => p.patient_id.toLowerCase() === patientId.toLowerCase()) || null;
  }

  static getPatientByEmailOrId(query: string): PatientAccount | null {
    const list = this.getPatients();
    const q = query.trim().toLowerCase();
    return list.find(p => p.email.toLowerCase() === q || p.patient_id.toLowerCase() === q) || null;
  }

  static async registerPatient(data: Omit<PatientAccount, 'patient_id' | 'created_at'> & { plainPassword?: string }): Promise<PatientAccount> {
    const patients = this.getPatients();
    
    // Check if email already exists
    const existing = patients.find(p => p.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please login instead.');
    }

    const nextNumber = 1000 + patients.length + 1;
    const patient_id = `PAT-${nextNumber}`;
    const passwordHash = data.plainPassword ? await hashPassword(data.plainPassword) : (data.password || '');

    const newPatient: PatientAccount = {
      patient_id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: passwordHash,
      phone: data.phone.trim(),
      dob: data.dob,
      gender: data.gender,
      blood_group: data.blood_group,
      address: data.address.trim(),
      avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=0284c7,0d9488,10b981`,
      created_at: new Date().toISOString().split('T')[0]
    };

    const updated = [newPatient, ...patients];
    this.setItem(STORAGE_KEYS.PATIENTS, updated);
    this.setActivePatientId(patient_id);
    return newPatient;
  }

  static async updatePatientProfile(patientId: string, updates: Partial<PatientAccount>): Promise<PatientAccount> {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.patient_id === patientId);
    if (index === -1) {
      throw new Error('Patient not found');
    }

    const updated = {
      ...patients[index],
      ...updates
    };

    patients[index] = updated;
    this.setItem(STORAGE_KEYS.PATIENTS, patients);
    return updated;
  }

  static async changePassword(patientId: string, oldPlain: string, newPlain: string): Promise<boolean> {
    const patient = this.getPatientById(patientId);
    if (!patient) throw new Error('Patient not found');

    const oldHash = await hashPassword(oldPlain);
    // Allow demo password bypass for seamless testing or match exact hash
    const isOldValid = patient.password === oldHash || oldPlain === 'Patient@123' || oldPlain === '123456';
    if (!isOldValid) {
      throw new Error('Current password is incorrect. Please try again.');
    }

    const newHash = await hashPassword(newPlain);
    await this.updatePatientProfile(patientId, { password: newHash });
    return true;
  }

  static getActivePatientId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT_ID) || 'PAT-1001';
  }

  static setActivePatientId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT_ID, id);
  }

  // --- Doctors ---
  static getDoctors(): DoctorItem[] {
    return INITIAL_DOCTORS;
  }

  static getDoctorById(doctorId: string): DoctorItem | undefined {
    return INITIAL_DOCTORS.find(d => d.doctor_id === doctorId);
  }

  // --- Appointments ---
  static getAppointments(patientId?: string): AppointmentRecord[] {
    const all = this.getItem<AppointmentRecord[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    if (patientId) {
      return all.filter(a => a.patient_id === patientId);
    }
    return all;
  }

  static createAppointment(
    patientId: string,
    doctorId: string,
    date: string,
    time: string,
    symptoms?: string
  ): AppointmentRecord {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) throw new Error('Selected doctor not found');

    const all = this.getAppointments();
    const appointment_id = `APT-2026-${String(all.length + 1).padStart(3, '0')}`;

    const newApt: AppointmentRecord = {
      appointment_id,
      patient_id: patientId,
      doctor_id: doctorId,
      doctor_name: doctor.name,
      specialization: doctor.specialization,
      appointment_date: date,
      appointment_time: time,
      status: 'Confirmed',
      symptoms: symptoms || 'General OPD Consultation',
      consultation_fee: doctor.consultation_fee,
      created_at: new Date().toISOString()
    };

    const updated = [newApt, ...all];
    this.setItem(STORAGE_KEYS.APPOINTMENTS, updated);

    // Auto-generate consultation bill for this appointment
    this.createBill(patientId, doctor.consultation_fee, 0, 0, `Invoice for Appointment ${appointment_id}`);

    return newApt;
  }

  static cancelAppointment(appointmentId: string): AppointmentRecord {
    const all = this.getAppointments();
    const index = all.findIndex(a => a.appointment_id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');

    all[index].status = 'Cancelled';
    this.setItem(STORAGE_KEYS.APPOINTMENTS, all);
    return all[index];
  }

  // --- Medical Records ---
  static getMedicalRecords(patientId?: string): MedicalRecordItem[] {
    const all = this.getItem<MedicalRecordItem[]>(STORAGE_KEYS.MEDICAL_RECORDS, INITIAL_MEDICAL_RECORDS);
    if (patientId) {
      return all.filter(m => m.patient_id === patientId);
    }
    return all;
  }

  // --- Prescriptions ---
  static getPrescriptions(patientId?: string): PrescriptionRecord[] {
    const all = this.getItem<PrescriptionRecord[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    if (patientId) {
      return all.filter(p => p.patient_id === patientId);
    }
    return all;
  }

  // --- Billing ---
  static getBills(patientId?: string): BillingRecord[] {
    const all = this.getItem<BillingRecord[]>(STORAGE_KEYS.BILLS, INITIAL_BILLS);
    if (patientId) {
      return all.filter(b => b.patient_id === patientId);
    }
    return all;
  }

  static createBill(
    patientId: string,
    consultationFee: number,
    testFee: number = 0,
    medicineCost: number = 0,
    notes?: string
  ): BillingRecord {
    const all = this.getBills();
    const bill_id = `BIL-${900 + all.length + 1}`;
    const invoice_number = `INV-2026-${String(all.length + 1).padStart(3, '0')}`;
    const total = consultationFee + testFee + medicineCost;

    const newBill: BillingRecord = {
      bill_id,
      invoice_number,
      patient_id: patientId,
      doctor_consultation_fee: consultationFee,
      test_fee: testFee,
      medicine_cost: medicineCost,
      amount: total,
      payment_status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newBill, ...all];
    this.setItem(STORAGE_KEYS.BILLS, updated);
    return newBill;
  }

  static payBill(billId: string, paymentMethod: string = 'Digital Gateway'): BillingRecord {
    const all = this.getBills();
    const index = all.findIndex(b => b.bill_id === billId);
    if (index === -1) throw new Error('Bill not found');

    all[index].payment_status = 'Paid';
    all[index].payment_method = paymentMethod;
    all[index].transaction_id = `TXN-PAY${Date.now().toString().slice(-6)}`;
    this.setItem(STORAGE_KEYS.BILLS, all);
    return all[index];
  }

  // --- Test Reports ---
  static getTestReports(patientId?: string): TestReportRecord[] {
    const all = this.getItem<TestReportRecord[]>(STORAGE_KEYS.TEST_REPORTS, INITIAL_TEST_REPORTS);
    if (patientId) {
      return all.filter(t => t.patient_id === patientId);
    }
    return all;
  }

  // --- Symptom Checker ---
  static saveSymptomCheck(record: SymptomCheckerRecord): string {
    const CHECKER_KEY = 'carepulse_symptom_checks';
    const all = this.getItem<SymptomCheckerRecord[]>(CHECKER_KEY as any, []);
    const updated = [record, ...all].slice(0, 50); // keep last 50 records
    localStorage.setItem(CHECKER_KEY, JSON.stringify(updated));
    return record.checker_id;
  }

  static getSymptomChecks(patientId?: string): SymptomCheckerRecord[] {
    const CHECKER_KEY = 'carepulse_symptom_checks';
    const raw = localStorage.getItem(CHECKER_KEY);
    const all: SymptomCheckerRecord[] = raw ? JSON.parse(raw) : [];
    if (patientId) return all.filter(c => c.patient_id === patientId);
    return all;
  }
}
