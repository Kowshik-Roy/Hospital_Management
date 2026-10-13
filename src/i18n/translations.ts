export type Language = 'en' | 'bn';

export const translations = {
  en: {
    hospitalName: 'CarePulse Hospital',
    hospitalSubtitle: 'Smart Healthcare & Hospital Management System',
    emergencyHotline: 'Emergency: 16263 / 999',
    bookAppointmentBtn: 'Book Appointment',
    rolePatient: 'Patient Portal',
    roleDoctor: 'Doctor Dashboard',
    roleAdmin: 'Hospital Admin',

    // Quick Stats
    statsTotalPatients: 'Total Registered Patients',
    statsActiveDoctors: 'Specialist Doctors on Duty',
    statsTodayAppointments: "Today's Appointments",
    statsBedOccupancy: 'Overall Bed Occupancy',
    statsIcuAvailable: 'ICU Beds Available',
    statsAmbulanceReady: 'Ambulance Units Ready',

    // Patient Portal
    findDoctorTitle: 'Find Specialist Doctors & Schedule Visit',
    findDoctorSubtitle: 'Choose from 8+ departments with verified visiting hours and instant appointment tokens.',
    searchPlaceholder: 'Search by doctor name, specialty, or condition (e.g. Heart, Child, Stroke)...',
    allDepartments: 'All Departments',
    visitingHours: 'Visiting Hours',
    consultFee: 'Consultation Fee',
    room: 'Room',
    experience: 'Experience',
    bookNow: 'Book Appointment',
    availableTodayBadge: 'Available Today',
    offDutyBadge: 'Off Duty Today',
    myAppointmentsTitle: 'My Appointment Records & Tokens',
    ticketNo: 'Token ID',
    patient: 'Patient',
    doctor: 'Doctor',
    department: 'Department',
    dateTime: 'Date & Time',
    status: 'Status',
    actions: 'Action',
    confirmed: 'Confirmed',
    pending: 'Pending Approval',
    completed: 'Completed',
    cancelled: 'Cancelled',
    viewPrescription: 'Prescription',
    noAppointments: 'No appointments booked yet. Book your first consultation above!',

    // Doctor Portal
    doctorWelcome: "Doctor's Daily Consultation Queue",
    doctorSubtitle: 'Manage incoming patient consultations, update clinical diagnosis & issue digital prescriptions.',
    patientQueue: 'Patient Queue for Today',
    symptomsTitle: 'Reported Symptoms',
    markCompleted: 'Mark as Completed',
    addPrescription: 'Add Prescription Notes',
    prescriptionSaved: 'Prescription notes saved successfully!',
    enterDiagnosis: 'Enter clinical diagnosis & medication advice...',
    saveNotes: 'Save Notes',

    // Admin Portal
    adminTitle: 'Central Hospital Administrative Command',
    adminSubtitle: 'Real-time monitoring of doctors, patients, appointment dispatch & bed occupancy.',
    addNewDoctor: 'Add New Doctor',
    manageAppointments: 'Appointment Dispatches',
    hospitalBeds: 'Live Bed & ICU Occupancy Monitor',
    totalBeds: 'Total Beds',
    occupiedBeds: 'Occupied',
    availableBeds: 'Available',
    ratePerDay: 'Rate / Day',
    updateStatus: 'Update Status',
    confirmAction: 'Confirm',
    cancelAction: 'Cancel',

    // Add Doctor Modal
    doctorNameLabel: 'Doctor Full Name',
    specialtyLabel: 'Specialty Title',
    degreesLabel: 'Medical Degrees (e.g. MBBS, FCPS)',
    selectDeptLabel: 'Department',
    feeLabel: 'Consultation Fee (BDT)',
    hoursLabel: 'Visiting Hours (e.g. 05:00 PM - 09:00 PM)',
    roomLabel: 'Assigned Room Number',
    phoneLabel: 'Contact Phone',
    saveDoctorBtn: 'Register Doctor to System',

    // Appointment Booking Modal
    bookModalTitle: 'Book Doctor Appointment',
    patientFullName: 'Patient Full Name',
    patientAge: 'Age (Years)',
    patientGender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    patientPhone: 'Mobile Phone Number',
    preferredDate: 'Preferred Appointment Date',
    preferredTime: 'Preferred Time Slot',
    symptomsDescription: 'Symptoms or Reason for Consultation',
    symptomsPlaceholder: 'Describe symptoms (e.g. fever for 3 days, chest discomfort, joint pain)...',
    confirmBookingBtn: 'Confirm Appointment',
    bookingSuccess: 'Appointment booked successfully! Your Token Number is',

    // Emergency Section
    emergencyBannerTitle: '24/7 Emergency Casualty & Ambulance Service',
    emergencyBannerText: 'Immediate response trauma center, mobile ICU ambulances, and blood transfusion support.',
    callAmbulance: 'Call Ambulance (999 / 16263)',
    bloodBankStatus: 'Blood Bank Stock Live',

    // AI Medical Assistant Chatbot
    chatBotTitle: 'CarePulse AI Healthcare Assistant',
    chatBotSubtitle: '24/7 Medical Triage, Doctor Finder & Hospital Guide',
    chatWelcomeGreeting: "Hello! I am CarePulse AI, your 24/7 hospital assistant. I can help you find the right specialist doctor based on your symptoms, check available visiting hours, book appointments, or view hospital bed availability. How can I help you today?",
    chatPlaceholder: 'Ask CarePulse AI anything (e.g. doctor timing, symptoms, ICU beds)...',
    chatSend: 'Send',
    chatThinking: 'CarePulse AI is thinking...',
    quickQuestions: 'Quick Inquiries:',
    chatPrompts: [
      'How to book an appointment?',
      'Which cardiologists are on duty today?',
      'How many ICU beds are available now?',
      'I have severe fever and chills, which doctor should I visit?'
    ],
    medicalDisclaimer: 'Note: CarePulse AI provides general hospital guidance. For critical emergencies, visit the Emergency ER immediately.',

    // General
    close: 'Close',
    search: 'Search',
    reset: 'Reset',
    filterByDept: 'Filter by Department:'
  },

  bn: {
    hospitalName: 'কেয়ারপাল্স হাসপাতাল',
    hospitalSubtitle: 'আধুনিক ওয়েব-ভিত্তিক হাসপাতাল ব্যবস্থাপনা প্ল্যাটফর্ম',
    emergencyHotline: 'জরুরী হটলাইন: ১৬২৬৩ / ৯৯৯',
    bookAppointmentBtn: 'অ্যাপয়েন্টমেন্ট নিন',
    rolePatient: 'রোগী পোর্টাল',
    roleDoctor: 'ডাক্তার ড্যাশবোর্ড',
    roleAdmin: 'প্রশাসনিক কন্ট্রোল',

    // Quick Stats
    statsTotalPatients: 'নিবন্ধিত মোট রোগী',
    statsActiveDoctors: 'অন-ডিউটি বিশেষজ্ঞ চিকিৎসক',
    statsTodayAppointments: 'আজকের মোট অ্যাপয়েন্টমেন্ট',
    statsBedOccupancy: 'হাসপাতালের বেড অকুপেন্সি',
    statsIcuAvailable: 'খালি আইসিইউ (ICU) সিট',
    statsAmbulanceReady: 'প্রস্তুত অ্যাম্বুলেন্স ইউনিট',

    // Patient Portal
    findDoctorTitle: 'বিশেষজ্ঞ চিকিৎসক খুঁজুন ও সিরিয়াল বুক করুন',
    findDoctorSubtitle: '৮টি বিশেষায়িত বিভাগের অভিজ্ঞ ডাক্তারদের ভিজিটিং সময় দেখে সহজে সিরিয়াল নিন।',
    searchPlaceholder: 'ডাক্তারের নাম, বিভাগ বা রোগের লক্ষণ লিখে খুঁজুন (যেমন: হার্ট, শিশু, প্রেশার, স্ট্রোক)...',
    allDepartments: 'সকল বিভাগ',
    visitingHours: 'রোগী দেখার সময়',
    consultFee: 'ভিজিট ফি',
    room: 'রুম নম্বর',
    experience: 'অভিজ্ঞতা',
    bookNow: 'সিরিয়াল নিন',
    availableTodayBadge: 'আজ রোগী দেখছেন',
    offDutyBadge: 'আজ চেম্বার বন্ধ',
    myAppointmentsTitle: 'আমার বুকিং ও প্রেসক্রিপশন সমূহ',
    ticketNo: 'টোকেন নং',
    patient: 'রোগীর নাম',
    doctor: 'চিকিৎসক',
    department: 'বিভাগ',
    dateTime: 'তারিখ ও সময়',
    status: 'অবস্থা',
    actions: 'অ্যাকশন',
    confirmed: 'নিশ্চিতকৃত',
    pending: 'অনুমোদন অপেক্ষমাণ',
    completed: 'সম্পন্ন',
    cancelled: 'বাতিল',
    viewPrescription: 'প্রেসক্রিপশন',
    noAppointments: 'এখনও কোনো অ্যাপয়েন্টমেন্ট বুক করা হয়নি। উপরে ডাক্তার নির্বাচন করে সিরিয়াল নিন।',

    // Doctor Portal
    doctorWelcome: 'ডাক্তার কনসালটেশন কিউ ও শিডিউল',
    doctorSubtitle: 'আজকের অপেক্ষমাণ রোগীদের সিরিয়াল দেখুন, চিকিৎসা দিন ও ডিজিটাল প্রেসক্রিপশন নোট লিখুন।',
    patientQueue: 'আজকের অপেক্ষমাণ রোগীর তালিকা',
    symptomsTitle: 'রোগীর প্রাথমিক লক্ষণ',
    markCompleted: 'রোগী দেখা সম্পন্ন করুন',
    addPrescription: 'প্রেসক্রিপশন নোট যোগ করুন',
    prescriptionSaved: 'প্রেসক্রিপশন নোট সফলভাবে সংরক্ষিত হয়েছে!',
    enterDiagnosis: 'রোগ নির্ণয় ও ঔষধের পরামর্শ এখানে লিখুন...',
    saveNotes: 'সংরক্ষণ করুন',

    // Admin Portal
    adminTitle: 'হাসপাতাল কেন্দ্রীয় প্রশাসনিক ড্যাশবোর্ড',
    adminSubtitle: 'ডাক্তারদের শিডিউল, রোগীর রেকর্ড, সিরিয়াল পর্যবেক্ষণ এবং বেড অকুপেন্সির পূর্ণাঙ্গ নিয়ন্ত্রণ।',
    addNewDoctor: 'নতুন ডাক্তার যোগ করুন',
    manageAppointments: 'অ্যাপয়েন্টমেন্ট নিয়ন্ত্রণ',
    hospitalBeds: 'লাইভ বেড ও আইসিইউ অকুপেন্সি মনিটর',
    totalBeds: 'মোট বেড',
    occupiedBeds: 'ভর্তি রোগী',
    availableBeds: 'খালি আছে',
    ratePerDay: 'প্রতিদিনের ভাড়া',
    updateStatus: 'স্ট্যাটাস আপডেট',
    confirmAction: 'কনফার্ম',
    cancelAction: 'বাতিল',

    // Add Doctor Modal
    doctorNameLabel: 'ডাক্তারের পুরো নাম',
    specialtyLabel: 'পদবী ও বিশেষত্ব',
    degreesLabel: 'ডিগ্রিসমূহ (যেমন: MBBS, FCPS, MD)',
    selectDeptLabel: 'বিভাগ নির্বাচন করুন',
    feeLabel: 'কনসালটেশন ফি (টাকা)',
    hoursLabel: 'ভিজিটিং সময় (যেমন: বিকাল ০৫:০০ - রাত ০৯:০০)',
    roomLabel: 'বরাদ্দকৃত রুম নম্বর',
    phoneLabel: 'যোগাযোগ নম্বর',
    saveDoctorBtn: 'সিস্টেমে ডাক্তার যুক্ত করুন',

    // Appointment Booking Modal
    bookModalTitle: 'ডাক্তার অ্যাপয়েন্টমেন্ট বুকিং ফরম',
    patientFullName: 'রোগীর পুরো নাম',
    patientAge: 'বয়স (বছর)',
    patientGender: 'লিঙ্গ',
    male: 'পুরুষ',
    female: 'মহিলা',
    other: 'অন্যান্য',
    patientPhone: 'মোবাইল নম্বর',
    preferredDate: 'কাঙ্ক্ষিত সাক্ষাতের তারিখ',
    preferredTime: 'সুবিধাজনক সময়',
    symptomsDescription: 'রোগের লক্ষণ বা সমস্যার বিবরণ',
    symptomsPlaceholder: 'সমস্যার বিবরণ দিন (যেমন: ৩ দিন ধরে তীব্র জ্বর, বুকে ব্যথা বা শ্বাসকষ্ট)...',
    confirmBookingBtn: 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন',
    bookingSuccess: 'অ্যাপয়েন্টমেন্ট সফলভাবে বুক হয়েছে! আপনার টোকেন নম্বর:',

    // Emergency Section
    emergencyBannerTitle: '২৪ ঘণ্টা জরুরী চিকিৎসা ও অ্যাম্বুলেন্স সেবা',
    emergencyBannerText: 'তাৎক্ষণিক ট্রমা কেয়ার, আইসিইউ অ্যাম্বুলেন্স ও ব্লাড ব্যাংক সেবা সবসময় প্রস্তুত।',
    callAmbulance: 'জরুরী কল করুন (৯৯৯ / ১৬২৬৩)',
    bloodBankStatus: 'লাইভ ব্লাড ব্যাংক স্টক',

    // AI Medical Assistant Chatbot
    chatBotTitle: 'কেয়ারপাল্স এআই মেডিকেল অ্যাসিস্ট্যান্ট',
    chatBotSubtitle: '২৪/৭ প্রাথমিক স্বাস্থ্য পরামর্শ ও অ্যাপয়েন্টমেন্ট সহায়ক',
    chatWelcomeGreeting: 'নমস্কার! আমি কেয়ারপাল্স এআই, আপনার সার্বক্ষণিক হাসপাতাল সহকারী। আপনার লক্ষণ অনুযায়ী সঠিক ডাক্তার বেছে নিতে, ভিজিটিং সময় জানতে, সিরিয়াল বুক করতে বা আইসিইউ বেডের খোঁজ নিতে আমি যেকোনো সময় প্রস্তুত। আপনাকে কীভাবে সাহায্য করতে পারি?',
    chatPlaceholder: 'কেয়ারপাল্স এআই-কে জিজ্ঞেস করুন (যেমন: ডাক্তার শিডিউল, আইসিইউ বেড, লক্ষণ)...',
    chatSend: 'পাঠান',
    chatThinking: 'কেয়ারপাল্স এআই ভাবছে...',
    quickQuestions: 'দ্রুত জানার বিষয়সমূহ:',
    chatPrompts: [
      'ডাক্তারের সিরিয়াল কীভাবে বুক করব?',
      'আজকে কোন কার্ডিওলজিস্ট ডাক্তার চেম্বারে আছেন?',
      'হাসপাতালে আইসিইউ (ICU) বেড খালি আছে কি?',
      'আমার জ্বর ও শরীরে ব্যথা, কোন ডাক্তারকে দেখাব?'
    ],
    medicalDisclaimer: 'সতর্কতা: এটি প্রাথমিক তথ্য প্রদানকারী এআই। গুরুতর জরুরী অবস্থায় সরাসরি জরুরী বিভাগে আসুন।',

    // General
    close: 'বন্ধ করুন',
    search: 'অনুসন্ধান',
    reset: 'রিসেট',
    filterByDept: 'বিভাগ অনুযায়ী ফিল্টার:'
  }
};
