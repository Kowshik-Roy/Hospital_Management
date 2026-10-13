export type UserRole = 'patient' | 'doctor' | 'admin' | 'cashier' | 'settings';

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export type ThemeColor = 'teal' | 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber';

export type PaymentStatus = 'paid' | 'pending' | 'partial';
export type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'cash' | 'insurance';

export interface HospitalSettings {
  hospitalName: string;
  hospitalNameBn: string;
  tagline: string;
  taglineBn: string;
  hotline: string;
  ambulancePhone: string;
  email: string;
  address: string;
  addressBn: string;
  themeColor: ThemeColor;
  currency: string;
  opdHours: string;
  licenseNumber: string;
  logoIcon: 'activity' | 'heart' | 'shield' | 'cross' | 'building';
  taxRatePercent?: number;
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  departmentId: string;
  specialty: string;
  specialtyBn: string;
  degrees: string;
  experienceYears: number;
  consultFee: number;
  availableDays: string[];
  visitingHours: string;
  roomNo: string;
  rating: number;
  reviewCount: number;
  phone: string;
  isAvailableToday: boolean;
  avatarUrl: string;
}

export interface Patient {
  id: string;
  name: string;
  nameBn?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email?: string;
  address: string;
  addressBn?: string;
  emergencyContact: string;
  emergencyContactName?: string;
  registeredDate: string;
  lastVisitDate?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  assignedDoctor?: string;
  activeBed?: string;
  medicalHistorySummary?: string;
}

export interface Appointment {
  id: string;
  ticketNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  doctorId: string;
  doctorName: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status: AppointmentStatus;
  fee: number;
  roomNo: string;
  prescriptionNotes?: string;
  medicines?: Array<{
    name: string;
    dosage: string;
    instruction: string;
    duration: string;
  }>;
}

export interface Department {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  headDoctor: string;
  totalDoctors: number;
  iconName: string;
  description: string;
  descriptionBn: string;
}

export interface BedCategory {
  id: string;
  name: string;
  nameBn: string;
  total: number;
  occupied: number;
  pricePerDay: number;
  type: 'icu' | 'ccu' | 'cabin' | 'ward';
}

export interface AmbulanceUnit {
  id: string;
  unitCode: string;
  driverName: string;
  driverPhone: string;
  type: 'icu' | 'general';
  status: 'ready' | 'on_call' | 'maintenance';
  currentLocation: string;
}

export interface BloodStockItem {
  group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  unitsAvailable: number;
  status: 'normal' | 'low' | 'critical';
}

export interface HospitalStats {
  totalPatientsCount: number;
  activeDoctorsCount: number;
  todayAppointmentsCount: number;
  bedOccupancyRate: number;
  emergencyBedsAvailable: number;
  ambulanceUnitsActive: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  descriptionBn?: string;
  category: 'consultation' | 'bed' | 'lab' | 'surgery' | 'medicine' | 'nursing' | 'emergency';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string; // e.g. "INV-2026-001"
  patientId: string;
  patientName: string;
  patientNameBn?: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  doctorId?: string;
  doctorName?: string;
  departmentName?: string;
  admissionDate?: string;
  dischargeDate?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  insuranceCovered: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testNameBn: string;
  date: string;
  department: string;
  resultSummary: string;
  resultSummaryBn: string;
  status: 'completed' | 'processing';
  normalRange: string;
  doctorPrescribed: string;
}

export interface AuthUser {
  id: string;
  role: 'patient' | 'doctor' | 'admin' | 'cashier';
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  patientId?: string;
  doctorId?: string;
  title?: string;
}
