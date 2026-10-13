package com.carepulse.hospital.service;

import com.carepulse.hospital.dto.AiChatRequest;
import com.carepulse.hospital.dto.AiChatResponse;
import com.carepulse.hospital.dto.AppointmentRequest;
import com.carepulse.hospital.dto.PaymentUpdateRequest;
import com.carepulse.hospital.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    private final Map<String, Patient> patients = new ConcurrentHashMap<>();
    private final Map<String, Doctor> doctors = new ConcurrentHashMap<>();
    private final Map<String, Appointment> appointments = new ConcurrentHashMap<>();
    private final Map<String, Invoice> invoices = new ConcurrentHashMap<>();
    private final Map<String, BedCategory> bedCategories = new ConcurrentHashMap<>();
    private HospitalSettings hospitalSettings = new HospitalSettings();

    public HospitalService() {
        seedInitialData();
    }

    private void seedInitialData() {
        // 1. Settings
        hospitalSettings.setHospitalName("CarePulse Hospital & Medical Center");
        hospitalSettings.setHospitalNameBn("কেয়ারপাল্স হাসপাতাল ও মেডিকেল সেন্টার");
        hospitalSettings.setTagline("Advanced Healthcare, Compassionate Clinical Excellence & 24/7 Smart Medical Services");
        hospitalSettings.setTaglineBn("উন্নত চিকিৎসা, মমতাময়ী সেবা ও ২৪/৭ স্মার্ট স্বাস্থ্য ব্যবস্থাপনা");
        hospitalSettings.setAddress("House 12, Road 5, Dhanmondi, Dhaka-1205");
        hospitalSettings.setAddressBn("বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা-১২০৫");
        hospitalSettings.setHotline("16263");
        hospitalSettings.setAmbulancePhone("+880 1711-000999");
        hospitalSettings.setEmail("emergency@carepulse-hospital.com");
        hospitalSettings.setWebsite("https://carepulse-hospital.com");
        hospitalSettings.setLicenseNumber("DGHS-REG-2026-98421");
        hospitalSettings.setTaxId("TIN-9823471029");
        hospitalSettings.setTaxRatePercent(5.0);
        hospitalSettings.setCurrency("BDT");
        hospitalSettings.setCurrencySymbol("৳");

        // 2. Doctors
        Doctor d1 = new Doctor("doc-1", "Dr. Ayesha Rahman", "ডা. আয়েশা রহমান", "dept-1",
                "Consultant Cardiologist", "হৃদরোগ ও রক্তচাপ বিশেষজ্ঞ", "MBBS, FCPS (Cardiology), MRCP (UK)",
                "12+ years experience", 1200.0, "Room 304, Level 3", "04:00 PM - 08:00 PM",
                "বিকাল ৪টা - রাত ৮টা", Arrays.asList("Sun", "Mon", "Wed", "Thu"), 4.9, 142,
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                "+880 1819-100201", true);

        Doctor d2 = new Doctor("doc-2", "Dr. Kazi Tanvir Ahmed", "ডা. কাজী তানভীর আহমেদ", "dept-2",
                "Senior Neurologist & Stroke Specialist", "মস্তিষ্ক, স্নায়ু ও স্ট্রোক বিশেষজ্ঞ", "MBBS, MD (Neurology), FACP (USA)",
                "15+ years experience", 1500.0, "Room 402, Level 4", "05:00 PM - 09:30 PM",
                "বিকাল ৫টা - রাত ৯:৩০", Arrays.asList("Sat", "Mon", "Tue", "Thu"), 4.95, 215,
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
                "+880 1712-400500", true);

        Doctor d3 = new Doctor("doc-3", "Dr. Nusrat Jahan", "ডা. নুসরাত জাহান", "dept-3",
                "Pediatric Specialist & Neonatologist", "শিশু ও নবজাতক রোগ বিশেষজ্ঞ", "MBBS, DCH, FCPS (Pediatrics)",
                "9+ years experience", 1000.0, "Room 205, Level 2", "10:00 AM - 02:00 PM",
                "সকাল ১০টা - দুপুর ২টা", Arrays.asList("Sat", "Sun", "Tue", "Wed", "Fri"), 4.88, 178,
                "https://images.unsplash.com/photo-1594824813590-4a87c1264c0f?auto=format&fit=crop&q=80&w=300",
                "+880 1913-600700", true);

        Doctor d4 = new Doctor("doc-4", "Prof. Dr. Mahbubur Rahman", "অধ্যাপক ডা. মাহবুবুর রহমান", "dept-4",
                "Orthopedic & Joint Replacement Surgeon", "হাড়, জোড়া ও ট্রমা সার্জারি বিশেষজ্ঞ", "MBBS, MS (Ortho), Fellow Arthroscopy (Singapore)",
                "20+ years experience", 1800.0, "Room 501, Level 5", "06:00 PM - 10:00 PM",
                "সন্ধ্যা ৬টা - রাত ১০টা", Arrays.asList("Sun", "Tue", "Wed"), 4.97, 310,
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
                "+880 1715-888222", true);

        doctors.put(d1.getId(), d1);
        doctors.put(d2.getId(), d2);
        doctors.put(d3.getId(), d3);
        doctors.put(d4.getId(), d4);

        // 3. Patients
        Patient p1 = new Patient("pat-1", "Kowshik Ahmed", "কৌশিক আহমেদ", "+880 1712-345678",
                "kowshik.patient@example.com", 32, "male", "O+", "+880 1911-223344",
                "Dhanmondi 27, Dhaka", "None reported (পেনিসিলিন এলার্জি নেই)", "2026-01-10",
                Arrays.asList("Mild Hypertension (প্রাথমিক উচ্চ রক্তচাপ)"));

        Patient p2 = new Patient("pat-2", "Sabina Yasmin", "সাবিনা ইয়াসমিন", "+880 1823-998877",
                "sabina.y@example.com", 45, "female", "B+", "+880 1812-445566",
                "Uttara Sector 4, Dhaka", "Dust, Pollen allergy", "2026-02-14",
                Arrays.asList("Type 2 Diabetes (ডায়াবেটিস)"));

        patients.put(p1.getId(), p1);
        patients.put(p2.getId(), p2);

        // 4. Bed Categories
        BedCategory b1 = new BedCategory("bed-1", "Intensive Care Unit (ICU)", "আইসিইউ (ICU)", "icu", 10, 4, 15000.0, "Level 6");
        BedCategory b2 = new BedCategory("bed-2", "Coronary Care Unit (CCU)", "সিসিইউ (CCU)", "ccu", 8, 3, 12000.0, "Level 6");
        BedCategory b3 = new BedCategory("bed-3", "VIP Executive Cabin", "ভিআইপি কেবিন", "cabin_vip", 12, 7, 8500.0, "Level 7");
        BedCategory b4 = new BedCategory("bed-4", "General Male/Female Ward", "জেনারেল ওয়ার্ড", "general", 40, 22, 1200.0, "Level 2 & 3");
        BedCategory b5 = new BedCategory("bed-5", "Pediatric Neonatal (NICU)", "এনআইসিইউ (NICU)", "pediatric", 10, 5, 9500.0, "Level 5");

        bedCategories.put(b1.getId(), b1);
        bedCategories.put(b2.getId(), b2);
        bedCategories.put(b3.getId(), b3);
        bedCategories.put(b4.getId(), b4);
        bedCategories.put(b5.getId(), b5);

        // 5. Appointments
        Appointment a1 = new Appointment();
        a1.setId("apt-101");
        a1.setDoctorId("doc-1");
        a1.setDoctorName("Dr. Ayesha Rahman");
        a1.setDepartmentName("Cardiology");
        a1.setPatientName("Kowshik Ahmed");
        a1.setPatientPhone("+880 1712-345678");
        a1.setPatientAge(32);
        a1.setPatientGender("male");
        a1.setDate("2026-10-15");
        a1.setTimeSlot("04:30 PM");
        a1.setStatus("confirmed");
        a1.setTicketNumber("CP-CARD-084");
        a1.setFee(1200.0);
        a1.setSymptoms("Occasional chest tightness and shortness of breath after climbing stairs");
        a1.setCreatedAt("2026-10-10");
        appointments.put(a1.getId(), a1);

        // 6. Invoices
        Invoice inv1 = new Invoice();
        inv1.setId("INV-2026-001");
        inv1.setPatientId("pat-1");
        inv1.setPatientName("Kowshik Ahmed");
        inv1.setPatientPhone("+880 1712-345678");
        inv1.setPatientAge(32);
        inv1.setPatientGender("male");
        inv1.setDoctorId("doc-1");
        inv1.setDoctorName("Dr. Ayesha Rahman");
        inv1.setDepartmentName("Cardiology");
        inv1.setDate("2026-10-10");
        inv1.setDueDate("2026-10-10");
        inv1.setItems(Arrays.asList(
                new InvoiceItem("item-1", "Cardiology OPD Consultation", "হৃদরোগ ওপিডি ফি", "consultation", 1, 1200.0, 1200.0),
                new InvoiceItem("item-2", "12-Lead Electrocardiogram (ECG)", "ইসিজি টেস্ট", "test", 1, 800.0, 800.0)
        ));
        inv1.setSubtotal(2000.0);
        inv1.setDiscountPercent(0.0);
        inv1.setDiscountAmount(0.0);
        inv1.setTaxPercent(5.0);
        inv1.setTaxAmount(100.0);
        inv1.setInsuranceCovered(0.0);
        inv1.setTotalAmount(2100.0);
        inv1.setPaidAmount(2100.0);
        inv1.setDueAmount(0.0);
        inv1.setStatus("paid");
        inv1.setPaymentMethod("bkash");
        inv1.setTransactionId("TXN-BK-991204");
        inv1.setNotes("Paid in full via bKash Merchant Gateway");
        invoices.put(inv1.getId(), inv1);
    }

    // Patients
    public List<Patient> getAllPatients() {
        return new ArrayList<>(patients.values());
    }

    public Patient getPatientById(String id) {
        return patients.get(id);
    }

    public Patient addPatient(Patient patient) {
        if (patient.getId() == null || patient.getId().isEmpty()) {
            patient.setId("pat-" + (patients.size() + 1));
        }
        if (patient.getRegisteredDate() == null) {
            patient.setRegisteredDate(LocalDate.now().format(DateTimeFormatter.ISO_DATE));
        }
        patients.put(patient.getId(), patient);
        return patient;
    }

    // Doctors
    public List<Doctor> getAllDoctors() {
        return new ArrayList<>(doctors.values());
    }

    public Doctor getDoctorById(String id) {
        return doctors.get(id);
    }

    public Doctor addDoctor(Doctor doctor) {
        if (doctor.getId() == null || doctor.getId().isEmpty()) {
            doctor.setId("doc-" + (doctors.size() + 1));
        }
        doctor.setRating(5.0);
        doctor.setReviewCount(1);
        doctor.setAvailable(true);
        doctors.put(doctor.getId(), doctor);
        return doctor;
    }

    // Appointments
    public List<Appointment> getAllAppointments() {
        return appointments.values().stream()
                .sorted(Comparator.comparing(Appointment::getDate).reversed())
                .collect(Collectors.toList());
    }

    public Appointment createAppointment(AppointmentRequest req) {
        Doctor doc = doctors.get(req.getDoctorId());
        String docName = doc != null ? doc.getName() : "Hospital Specialist";
        String deptName = doc != null ? doc.getSpecialty() : "General Medicine";
        double fee = doc != null ? doc.getFee() : 1000.0;

        Appointment apt = new Appointment();
        apt.setId("apt-" + (appointments.size() + 101));
        apt.setDoctorId(req.getDoctorId());
        apt.setDoctorName(docName);
        apt.setDepartmentName(deptName);
        apt.setPatientName(req.getPatientName());
        apt.setPatientPhone(req.getPatientPhone());
        apt.setPatientAge(req.getPatientAge());
        apt.setPatientGender(req.getPatientGender());
        apt.setDate(req.getDate());
        apt.setTimeSlot(req.getTimeSlot());
        apt.setStatus("confirmed");
        apt.setTicketNumber("CP-" + (100 + appointments.size() + 1));
        apt.setFee(fee);
        apt.setSymptoms(req.getSymptoms());
        apt.setCreatedAt(LocalDate.now().format(DateTimeFormatter.ISO_DATE));

        appointments.put(apt.getId(), apt);

        // Also generate pending invoice
        Invoice inv = new Invoice();
        inv.setId("INV-2026-" + String.format("%03d", invoices.size() + 1));
        inv.setPatientId("pat-1");
        inv.setPatientName(req.getPatientName());
        inv.setPatientPhone(req.getPatientPhone());
        inv.setPatientAge(req.getPatientAge());
        inv.setPatientGender(req.getPatientGender());
        inv.setDoctorId(req.getDoctorId());
        inv.setDoctorName(docName);
        inv.setDepartmentName(deptName);
        inv.setDate(req.getDate());
        inv.setDueDate(req.getDate());
        inv.setItems(Collections.singletonList(
                new InvoiceItem("item-" + System.currentTimeMillis(), "Doctor OPD Consultation (" + docName + ")",
                        "ডাক্তার কনসালটেশন ফি", "consultation", 1, fee, fee)
        ));
        inv.setSubtotal(fee);
        inv.setTaxPercent(hospitalSettings.getTaxRatePercent());
        double tax = (fee * hospitalSettings.getTaxRatePercent()) / 100.0;
        inv.setTaxAmount(tax);
        inv.setTotalAmount(fee + tax);
        inv.setPaidAmount(0.0);
        inv.setDueAmount(fee + tax);
        inv.setStatus("pending");
        inv.setPaymentMethod("cash");
        inv.setNotes("Auto-generated for Appointment Token: " + apt.getTicketNumber());

        invoices.put(inv.getId(), inv);

        return apt;
    }

    public Appointment updateAppointmentStatus(String id, String status) {
        Appointment apt = appointments.get(id);
        if (apt != null) {
            apt.setStatus(status);
            return apt;
        }
        return null;
    }

    public Appointment savePrescription(String id, String notes, List<Medicine> medicines) {
        Appointment apt = appointments.get(id);
        if (apt != null) {
            apt.setPrescriptionNotes(notes);
            apt.setMedicines(medicines);
            apt.setStatus("completed");
            return apt;
        }
        return null;
    }

    // Invoices
    public List<Invoice> getAllInvoices() {
        return invoices.values().stream()
                .sorted(Comparator.comparing(Invoice::getId).reversed())
                .collect(Collectors.toList());
    }

    public Invoice createInvoice(Invoice invoice) {
        if (invoice.getId() == null || invoice.getId().isEmpty()) {
            invoice.setId("INV-2026-" + String.format("%03d", invoices.size() + 1));
        }
        invoices.put(invoice.getId(), invoice);
        return invoice;
    }

    public Invoice updatePayment(String invoiceId, PaymentUpdateRequest req) {
        Invoice inv = invoices.get(invoiceId);
        if (inv != null) {
            inv.setPaidAmount(req.getPaidAmount());
            inv.setDueAmount(Math.max(0, inv.getTotalAmount() - req.getPaidAmount()));
            inv.setStatus(req.getStatus());
            inv.setPaymentMethod(req.getPaymentMethod());
            inv.setTransactionId(req.getTransactionId() != null ? req.getTransactionId() : "TXN-" + System.currentTimeMillis() % 1000000);
            return inv;
        }
        return null;
    }

    // Beds
    public List<BedCategory> getAllBedCategories() {
        return new ArrayList<>(bedCategories.values());
    }

    public BedCategory updateBedOccupancy(String bedId, int delta) {
        BedCategory bed = bedCategories.get(bedId);
        if (bed != null) {
            int newOccupied = Math.max(0, Math.min(bed.getTotal(), bed.getOccupied() + delta));
            bed.setOccupied(newOccupied);
            return bed;
        }
        return null;
    }

    // Settings
    public HospitalSettings getSettings() {
        return hospitalSettings;
    }

    public HospitalSettings updateSettings(HospitalSettings newSettings) {
        this.hospitalSettings = newSettings;
        return this.hospitalSettings;
    }

    // Stats
    public Map<String, Object> getHospitalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctors.size());
        stats.put("totalPatients", patients.size());
        stats.put("totalAppointments", appointments.size());
        stats.put("totalInvoices", invoices.size());
        double totalRevenue = invoices.values().stream().mapToDouble(Invoice::getPaidAmount).sum();
        stats.put("totalRevenue", totalRevenue);
        int totalBeds = bedCategories.values().stream().mapToInt(BedCategory::getTotal).sum();
        int occupiedBeds = bedCategories.values().stream().mapToInt(BedCategory::getOccupied).sum();
        stats.put("totalBeds", totalBeds);
        stats.put("occupiedBeds", occupiedBeds);
        stats.put("availableBeds", totalBeds - occupiedBeds);
        BedCategory icu = bedCategories.get("bed-1");
        stats.put("icuAvailable", icu != null ? icu.getAvailable() : 6);
        return stats;
    }

    // AI Medical Assistant Query
    public AiChatResponse processAiQuery(AiChatRequest request) {
        String lang = request.getLanguage() != null ? request.getLanguage() : "bn";
        String msg = request.getMessage() != null ? request.getMessage().toLowerCase() : "";

        if (lang.equalsIgnoreCase("bn")) {
            if (msg.contains("ডাক্তার") || msg.contains("অ্যাপয়েন্টমেন্ট") || msg.contains("বুকিং")) {
                return new AiChatResponse(
                        "কেয়ারপাল্স হাসপাতালে আমাদের বিশিষ্ট কার্ডিওলজি, নিউরোলজি, পেডিয়াট্রিক্স ও অর্থোপেডিক্স বিশেষজ্ঞ ডাক্তারগণ উপস্থিত রয়েছেন। আপনি উপরের 'অ্যাপয়েন্টমেন্ট বুকিং' বাটনে ক্লিক করে বা পছন্দের ডাক্তারের কার্ড থেকে সরাসরি সময় বেছে নিয়ে বুকিং সম্পন্ন করতে পারেন।",
                        Arrays.asList("কার্ডিওলজিস্ট ডাক্তারদের তালিকা", "অ্যাপয়েন্টমেন্ট শিডিউল সময়", "জরুরি হটলাইন নম্বর")
                );
            } else if (msg.contains("আইসিইউ") || msg.contains("icu") || msg.contains("বেড") || msg.contains("ভর্তি")) {
                BedCategory icu = bedCategories.get("bed-1");
                int vacant = icu != null ? icu.getAvailable() : 6;
                return new AiChatResponse(
                        "বর্তমানে কেয়ারপাল্স সেন্টারে মোট " + vacant + "টি আইসিইউ (ICU) বেড খালি ও প্রস্তুত রয়েছে। জরুরি রোগীর তাৎক্ষণিক ভর্তির জন্য আমাদের ২৪/৭ হটলাইন ১৬২৬৩ নম্বরে এখনই কল করুন।",
                        Arrays.asList("আইসিইউ বেড বুকিং", "অ্যাম্বুলেন্স কল করুন", "ভর্তি প্রক্রিয়া")
                );
            } else if (msg.contains("বিল") || msg.contains("খরচ") || msg.contains("পেমেন্ট") || msg.contains("টাকা")) {
                return new AiChatResponse(
                        "আমাদের বিলিং কাউন্টারে নগদ টাকা, ক্রেডিট কার্ড, বিকাশ, নগদ ও রকেটের মাধ্যমে ইনস্ট্যান্ট পেমেন্ট করা যায়। পেমেন্ট সম্পন্ন হলে সাথে সাথে অফিশিয়াল ইনভয়েস স্লিপ ও ডিজিটাল রসিদ ডাউনলোড করা যায়।",
                        Arrays.asList("বিকাশে পেমেন্ট কীভাবে করব?", "ইনভয়েস ডাউনলোড", "ক্যাশ কাউন্টার")
                );
            } else {
                return new AiChatResponse(
                        "নমস্কার! আমি কেয়ারপাল্স হসপিটাল এর এআই মেডিকেল অ্যাসিস্ট্যান্ট (CarePulse AI)। আমি আপনাকে ডাক্তারদের সময়সূচী, অ্যাপয়েন্টমেন্ট বুকিং, জরুরী অ্যাম্বুলেন্স সেবা এবং প্রাথমিক স্বাস্থ্য তথ্যে সাহায্য করতে পারি। আপনার কী সেবা প্রয়োজন?",
                        Arrays.asList("ডাক্তারের অ্যাপয়েন্টমেন্ট কীভাবে বুক করব?", "কার্ডিওলজিস্ট ডাক্তার কারা আছেন?", "জরুরী আইসিইউ (ICU) সিট খালি আছে কি?")
                );
            }
        } else {
            if (msg.contains("doctor") || msg.contains("appointment") || msg.contains("booking")) {
                return new AiChatResponse(
                        "We have specialists across Cardiology, Neurology, Pediatrics, and Orthopedics. You can book an instant appointment by clicking the 'Book Appointment' button at the top or choosing your preferred doctor profile.",
                        Arrays.asList("View Doctor Directory", "Check Available Slots", "Emergency Contact")
                );
            } else if (msg.contains("icu") || msg.contains("bed") || msg.contains("admission")) {
                BedCategory icu = bedCategories.get("bed-1");
                int vacant = icu != null ? icu.getAvailable() : 6;
                return new AiChatResponse(
                        "Currently, " + vacant + " ICU beds are available and ready for critical admissions. For immediate transfer, dial our 24/7 Hotline: 16263.",
                        Arrays.asList("Call Ambulance Now", "ICU Admission Rules", "View Bed Monitor")
                );
            } else {
                return new AiChatResponse(
                        "Hello! I am CarePulse AI Healthcare Assistant. I can assist you with doctor schedules, OPD appointments, emergency ambulance dispatch, bed occupancy, and billing queries. How can I help you today?",
                        Arrays.asList("How to book an appointment?", "Which cardiologists are available?", "Are ICU beds vacant?")
                );
            }
        }
    }
}
