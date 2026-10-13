import React from 'react';
import {
  Appointment,
  Department,
  Doctor,
  HospitalSettings,
  Invoice,
  LabReport,
  Patient
} from '../types/hospital';
import { Language } from '../i18n/translations';
import { PatientAccount } from '../types/patientModule';
import { PatientDB } from '../services/patientService';
import { PatientDashboard } from './patient/PatientDashboard';

interface PatientPortalProps {
  language: Language;
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  invoices: Invoice[];
  labReports: LabReport[];
  currentPatient: Patient;
  allPatients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onOpenBookingModal: (doctorId?: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  hospitalSettings: HospitalSettings;
  onOpenSymptomChecker: () => void;
  onOpenBillingTab: () => void;
  onPayInvoice: (inv: Invoice) => void;
  onDownloadInvoicePdf: (inv: Invoice) => void;
  onLogout?: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  currentPatient,
  onLogout,
}) => {
  // Try to find the patient in the PatientDB service first, or map from currentPatient
  const existingAccount = PatientDB.getPatientById(currentPatient.id) || PatientDB.getPatients()[0];

  const activePatientAccount: PatientAccount = existingAccount || {
    patient_id: currentPatient.id || 'PAT-1001',
    name: currentPatient.name || 'Rahim Uddin',
    email: currentPatient.email || 'rahim@carepulse.hospital',
    phone: currentPatient.phone || '01712-345678',
    dob: '1990-05-15',
    gender: currentPatient.gender === 'female' ? 'Female' : currentPatient.gender === 'other' ? 'Other' : 'Male',
    blood_group: (currentPatient.bloodGroup as any) || 'O+',
    address: currentPatient.address || 'House #42, Road #7, Dhanmondi, Dhaka',
    avatar_url:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    created_at: currentPatient.registeredDate || '2026-01-10',
  };

  return (
    <div className="w-full">
      <PatientDashboard
        currentPatient={activePatientAccount}
        onLogout={onLogout || (() => window.location.reload())}
      />
    </div>
  );
};
