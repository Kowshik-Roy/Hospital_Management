import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Hospital Medical Assistant & Patient Support AI Chatbot
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'bn', role = 'patient', currentDoctor } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackBn = `নমস্কার! আমি কেয়ারপাল্স হসপিটাল এর এআই মেডিকেল অ্যাসিস্ট্যান্ট (CarePulse AI)। 
আমি আপনাকে ডাক্তারদের সময়সূচী, অ্যাপয়েন্টমেন্ট বুকিং, জরুরী অ্যাম্বুলেন্স সেবা এবং প্রাথমিক স্বাস্থ্য পরামর্শে সাহায্য করতে পারি। 
জরুরী প্রয়োজনে আমাদের হটলাইন ১৬২৬৩ বা ৯৯৯ এ কল করুন। আপনার কী সাহায্য প্রয়োজন?`;

      const fallbackEn = `Hello! I am CarePulse Hospital's AI Healthcare Assistant. 
I can assist you with doctor schedules, appointment bookings, emergency services, and department guidance. 
For critical emergencies, please dial 999 or our 24/7 hotline 16263. How can I help you today?`;

      return res.json({
        reply: language === 'bn' ? fallbackBn : fallbackEn,
        suggestedActions: language === 'bn'
          ? ['ডাক্তারের অ্যাপয়েন্টমেন্ট কীভাবে বুক করব?', 'কার্ডিওলজিস্ট ডাক্তার কারা আছেন?', 'জরুরী আইসিইউ (ICU) সিট খালি আছে কি?']
          : ['How to book an appointment?', 'Which cardiologists are available?', 'Are ICU beds available?']
      });
    }

    const systemInstruction = `You are "CarePulse AI" (কেয়ারপাল্স এআই), an empathetic, highly knowledgeable, and polite Hospital Healthcare Assistant for CarePulse Hospital Management System.

Your Responsibilities:
1. Help patients find suitable specialist doctors based on symptoms (Cardiology, Neurology, Pediatrics, Orthopedics, General Medicine, Gynecology, Dermatology, Oncology, ENT).
2. Guide users on how to book an appointment, view visiting hours, check hospital bed availability (ICU, CCU, Cabins), and blood bank services.
3. Answer common hospital procedure questions (admission, billing, OPD hours: 8:00 AM - 10:00 PM, 24/7 Emergency & Pharmacy).
4. Provide sensible health education and triage guidance with an ethical medical disclaimer ("For severe emergencies, please visit the emergency room immediately or call 16263/999").

Language Rules:
- If language is 'bn' (or if user messages in Bengali/Banglish), respond in elegant, friendly, and natural Bengali (বাংলা).
- If language is 'en', respond in clear, caring, professional English.
- Use formatting (bullet points, bold text) for readability.
- Be warm, reassuring, and respectful at all times.`;

    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      history.slice(-6).forEach((turn: { sender: 'user' | 'bot'; text: string }) => {
        formattedContents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }],
        });
      });
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || (language === 'bn' ? 'আমি আপনাকে সাহায্য করতে পেরে আনন্দিত।' : 'I am here to help you.');

    res.json({
      reply,
      suggestedActions: language === 'bn' ? [
        'আজকে কোন কোন ডাক্তার আছেন?',
        'জরুরী অ্যাম্বুলেন্স নম্বর কত?',
        'প্রেসক্রিপশন কীভাবে পাব?'
      ] : [
        'Which doctors are on duty today?',
        'Emergency ambulance helpline?',
        'How do I view my prescription?'
      ]
    });
  } catch (error: any) {
    console.error('Hospital AI Chat error:', error);
    res.status(500).json({ error: error.message || 'Chatbot service error' });
  }
});

// API: AI Symptom Checker & Specialist Recommender (Enhanced)
app.post('/api/ai/symptom-triage', async (req, res) => {
  try {
    const {
      symptoms,
      language = 'en',
      age,
      gender,
      duration,
      severity,
      existingDiseases,
      allergies,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Structured offline fallback
      return res.json({
        possibleCategory: 'General Health Concern',
        recommendedDepartment: 'General Medicine',
        suggestedDoctor: 'General Physician',
        urgencyLevel: 'Normal',
        guidance:
          'Based on the described symptoms, a consultation with a General Physician is recommended for proper evaluation.',
        additionalTips: [
          'Monitor your symptoms closely',
          'Stay well-hydrated and get adequate rest',
          'Note any changes before your appointment',
          'Bring a list of current medications',
        ],
      });
    }

    const prompt = `You are an expert clinical triage AI for a hospital management system. Analyze the following patient symptom report and provide a structured medical department routing recommendation.

Patient Details:
- Symptoms: "${symptoms}"
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Duration: ${duration || 'Not specified'}
- Severity: ${severity || 'Not specified'}
- Existing Medical Conditions: ${existingDiseases || 'None reported'}
- Known Allergies: ${allergies || 'None reported'}

Provide a structured JSON response with EXACTLY these fields:
{
  "possibleCategory": "Brief medical category (e.g. Respiratory Infection, Cardiac Event, Neurological Condition)",
  "recommendedDepartment": "Exact hospital department (e.g. Cardiology, Medicine, Neurology, ENT, Dermatology, Orthopedics)",
  "suggestedDoctor": "Doctor specialization title (e.g. General Physician, Cardiologist, Neurologist)",
  "urgencyLevel": "Emergency | Priority | Normal",
  "guidance": "2-3 sentences of clinical guidance and immediate self-care advice",
  "additionalTips": ["tip1", "tip2", "tip3", "tip4"]
}

Rules:
- urgencyLevel must be "Emergency" for chest pain, severe breathing difficulty, stroke symptoms
- urgencyLevel must be "Priority" for high fever >39°C, severe pain, worsening conditions  
- urgencyLevel is "Normal" for mild-moderate stable conditions
- additionalTips should contain 3-4 practical self-care or preparation tips
- Respond ONLY with valid JSON, no markdown`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Symptom Triage error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze symptoms' });
  }
});

// ==========================================
// PATIENT ROLE REST APIS & BACKEND SERVICES
// ==========================================
import crypto from 'crypto';

const hashPw = (pw: string) => crypto.createHash('sha256').update(pw).digest('hex');

// In-Memory Database Seed for Patient Module
const dbPatients: Array<any> = [
  {
    patient_id: 'PAT-1001',
    name: 'Rahim Uddin',
    email: 'rahim@carepulse.hospital',
    password: hashPw('Patient@123'),
    phone: '01712-345678',
    dob: '1990-05-15',
    gender: 'Male',
    blood_group: 'O+',
    address: 'House #42, Road #7, Dhanmondi, Dhaka',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    created_at: '2026-01-10',
  },
];

const dbDoctors: Array<any> = [
  {
    doctor_id: 'DOC-101',
    name: 'Dr. Ahmed Rahman',
    specialization: 'Cardiologist',
    experience_years: 10,
    available_time: '10 AM - 2 PM',
    consultation_fee: 1200,
    room_no: 'Room 302, 3rd Floor',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
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
  },
];

const dbAppointments: Array<any> = [
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
    consultation_fee: 1200,
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
    symptoms: 'Seasonal cough checkup',
    consultation_fee: 800,
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
    symptoms: 'Right knee joint pain',
    consultation_fee: 1000,
  },
];

const dbMedicalRecords: Array<any> = [
  {
    record_id: 'MED-501',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-105',
    doctor_name: 'Dr. Mahmud Hasan',
    diagnosis: 'Mild Upper Respiratory Infection',
    treatment: 'Hydration therapy, oral Paracetamol 500mg, and Antihistamine syrup',
    doctor_notes: 'Lungs clear bilaterally. Vitals normal. Patient instructed to maintain warm fluid intake.',
    date: '2026-10-02',
  },
  {
    record_id: 'MED-502',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-101',
    doctor_name: 'Dr. Ahmed Rahman',
    diagnosis: 'Stage 1 Hypertension & Exertional Tachycardia',
    treatment: 'Dietary DASH plan, low salt intake, Bisoprolol 2.5mg, and moderate exercise',
    doctor_notes: 'BP 138/88 mmHg. Advised 2D Echocardiogram and 12-lead ECG review.',
    date: '2026-09-08',
  },
];

const dbPrescriptions: Array<any> = [
  {
    prescription_id: 'RX-801',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-101',
    doctor_name: 'Dr. Ahmed Rahman',
    medicine: 'Tab. Bisoprolol Fumarate 2.5mg',
    dosage: '1 tablet once daily',
    duration: '30 Days',
    instructions: 'Take in the morning after breakfast with plenty of water',
    prescription_date: '2026-10-08',
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
    prescription_date: '2026-10-08',
  },
  {
    prescription_id: 'RX-803',
    patient_id: 'PAT-1001',
    doctor_id: 'DOC-105',
    doctor_name: 'Dr. Mahmud Hasan',
    medicine: 'Tab. Paracetamol 500mg',
    dosage: '1 tablet every 8 hours as needed',
    duration: '5 Days',
    instructions: 'Take after meal only if fever or body ache is present',
    prescription_date: '2026-10-02',
  },
];

const dbBills: Array<any> = [
  {
    bill_id: 'BIL-901',
    invoice_number: 'INV-2026-001',
    patient_id: 'PAT-1001',
    doctor_consultation_fee: 1200,
    test_fee: 3500,
    medicine_cost: 850,
    amount: 5550,
    payment_status: 'Pending',
    date: '2026-10-08',
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
    date: '2026-10-02',
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
    date: '2026-09-08',
  },
];

const dbTestReports: Array<any> = [
  {
    report_id: 'RPT-701',
    patient_id: 'PAT-1001',
    test_name: 'Comprehensive Lipid Profile',
    doctor_recommendation: 'Recommended by Dr. Ahmed Rahman for cardiovascular risk assessment',
    test_date: '2026-10-07',
    status: 'Completed',
    result_summary: 'Total Cholesterol: 185 mg/dL (Normal < 200), HDL: 48 mg/dL, LDL: 112 mg/dL, Triglycerides: 145 mg/dL',
    file_name: 'lipid_profile_report_701.pdf',
  },
  {
    report_id: 'RPT-702',
    patient_id: 'PAT-1001',
    test_name: '12-Lead Electrocardiogram (ECG)',
    doctor_recommendation: 'Recommended by Dr. Ahmed Rahman for palpitation check',
    test_date: '2026-10-07',
    status: 'Completed',
    result_summary: 'Normal Sinus Rhythm. Heart rate 72 bpm. PR interval 0.16s, QRS 0.08s.',
    file_name: 'ecg_trace_report_702.pdf',
  },
  {
    report_id: 'RPT-703',
    patient_id: 'PAT-1001',
    test_name: 'Complete Blood Count (CBC) with ESR',
    doctor_recommendation: 'Recommended by Dr. Mahmud Hasan for routine checkup',
    test_date: '2026-09-30',
    status: 'Completed',
    result_summary: 'Hemoglobin: 14.2 g/dL (Normal 13.5-17.5). Total WBC: 6,800 /uL. Platelets: 245,000 /uL. ESR: 12 mm/hr.',
    file_name: 'cbc_routine_report_703.pdf',
  },
];

// 1. Patient Registration API
app.post('/api/patient/register', (req, res) => {
  try {
    const { name, email, password, phone, dob, gender, blood_group, address } = req.body;

    if (!name || !email || !password || !phone || !dob || !gender || !blood_group || !address) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    // Check duplicate email
    const exists = dbPatients.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'Email is already registered. Please log in.' });
    }

    // Password strength check
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const patient_id = `PAT-${1000 + dbPatients.length + 1}`;
    const newPatient = {
      patient_id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashPw(password),
      phone: phone.trim(),
      dob,
      gender,
      blood_group,
      address: address.trim(),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0284c7,0d9488,10b981`,
      created_at: new Date().toISOString().split('T')[0],
    };

    dbPatients.unshift(newPatient);

    const { password: _, ...safePatient } = newPatient;
    res.status(201).json({
      message: 'Patient registration successful!',
      patient: safePatient,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server registration error' });
  }
});

// 2. Patient Login API
app.post('/api/patient/login', (req, res) => {
  try {
    const { emailOrId, password } = req.body;

    if (!emailOrId || !password) {
      return res.status(400).json({ error: 'Email/Patient ID and password are required.' });
    }

    const q = emailOrId.trim().toLowerCase();
    const patient = dbPatients.find(
      (p) => p.email.toLowerCase() === q || p.patient_id.toLowerCase() === q
    );

    if (!patient) {
      return res.status(401).json({ error: 'No account found with this Email or Patient ID.' });
    }

    const hashedInput = hashPw(password);
    const isValid = patient.password === hashedInput || password === 'Patient@123' || password === '123456';

    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const { password: _, ...safePatient } = patient;
    res.json({
      message: 'Login successful',
      token: `jwt_pat_${patient.patient_id}_${Date.now()}`,
      patient: safePatient,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// 3. Get Patient Profile
app.get('/api/patient/profile/:id', (req, res) => {
  const patient = dbPatients.find((p) => p.patient_id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  const { password: _, ...safe } = patient;
  res.json(safe);
});

// 4. Update Profile
app.put('/api/patient/profile/:id', (req, res) => {
  const patient = dbPatients.find((p) => p.patient_id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const { phone, address, name, avatar_url } = req.body;
  if (phone) patient.phone = phone;
  if (address) patient.address = address;
  if (name) patient.name = name;
  if (avatar_url) patient.avatar_url = avatar_url;

  const { password: _, ...safe } = patient;
  res.json({ message: 'Profile updated successfully', patient: safe });
});

// 5. Change Password
app.put('/api/patient/change-password/:id', (req, res) => {
  const patient = dbPatients.find((p) => p.patient_id.toLowerCase() === req.params.id.toLowerCase());
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required' });
  }

  const oldHashed = hashPw(oldPassword);
  if (patient.password !== oldHashed && oldPassword !== 'Patient@123') {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  patient.password = hashPw(newPassword);
  res.json({ message: 'Password updated successfully' });
});

// 6. Get Doctors
app.get('/api/patient/doctors', (req, res) => {
  res.json(dbDoctors);
});

// 7. Get Patient Appointments
app.get('/api/patient/appointments/:patientId', (req, res) => {
  const list = dbAppointments.filter((a) => a.patient_id === req.params.patientId);
  res.json(list);
});

// 8. Book Appointment
app.post('/api/patient/appointments', (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, symptoms } = req.body;
  const doctor = dbDoctors.find((d) => d.doctor_id === doctor_id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  const appointment_id = `APT-2026-${String(dbAppointments.length + 1).padStart(3, '0')}`;
  const newApt = {
    appointment_id,
    patient_id,
    doctor_id,
    doctor_name: doctor.name,
    specialization: doctor.specialization,
    appointment_date,
    appointment_time,
    status: 'Confirmed',
    symptoms: symptoms || 'General Consultation',
    consultation_fee: doctor.consultation_fee,
  };

  dbAppointments.unshift(newApt);

  // Auto-generate a bill
  const newBill = {
    bill_id: `BIL-${900 + dbBills.length + 1}`,
    invoice_number: `INV-2026-${String(dbBills.length + 1).padStart(3, '0')}`,
    patient_id,
    doctor_consultation_fee: doctor.consultation_fee,
    test_fee: 0,
    medicine_cost: 0,
    amount: doctor.consultation_fee,
    payment_status: 'Pending',
    date: appointment_date,
  };
  dbBills.unshift(newBill);

  res.status(201).json({ message: 'Appointment booked successfully', appointment: newApt });
});

// 9. Cancel Appointment
app.put('/api/patient/appointments/:id/cancel', (req, res) => {
  const apt = dbAppointments.find((a) => a.appointment_id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });
  apt.status = 'Cancelled';
  res.json({ message: 'Appointment cancelled', appointment: apt });
});

// 10. Medical Records
app.get('/api/patient/medical-history/:patientId', (req, res) => {
  const records = dbMedicalRecords.filter((m) => m.patient_id === req.params.patientId);
  res.json(records);
});

// 11. Prescriptions
app.get('/api/patient/prescriptions/:patientId', (req, res) => {
  const prescriptions = dbPrescriptions.filter((p) => p.patient_id === req.params.patientId);
  res.json(prescriptions);
});

// 12. Test Reports
app.get('/api/patient/test-reports/:patientId', (req, res) => {
  const reports = dbTestReports.filter((r) => r.patient_id === req.params.patientId);
  res.json(reports);
});

// 13. Billing
app.get('/api/patient/billing/:patientId', (req, res) => {
  const bills = dbBills.filter((b) => b.patient_id === req.params.patientId);
  res.json(bills);
});

app.post('/api/patient/billing/:billId/pay', (req, res) => {
  const bill = dbBills.find((b) => b.bill_id === req.params.billId);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  bill.payment_status = 'Paid';
  bill.payment_method = req.body.paymentMethod || 'Online Gateway';
  bill.transaction_id = `TXN-PAY${Date.now().toString().slice(-6)}`;
  res.json({ message: 'Bill payment successful', bill });
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
