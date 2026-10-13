import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  Printer,
  X,
  Sparkles,
  User,
  Building,
  Check,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import {
  Doctor,
  HospitalSettings,
  Invoice,
  InvoiceItem,
  Patient,
  PaymentMethod,
  PaymentStatus,
  UserRole
} from '../types/hospital';
import { Language, translations } from '../i18n/translations';

interface BillingSystemProps {
  language: Language;
  invoices: Invoice[];
  patients: Patient[];
  doctors: Doctor[];
  hospitalSettings: HospitalSettings;
  activeRole: UserRole;
  currentPatientId?: string;
  onSaveInvoice: (newInvoice: Invoice) => void;
  onUpdateInvoiceStatus: (
    invoiceId: string,
    paidAmount: number,
    status: PaymentStatus,
    paymentMethod: PaymentMethod
  ) => void;
}

export const BillingSystem: React.FC<BillingSystemProps> = ({
  language,
  invoices,
  patients,
  doctors,
  hospitalSettings,
  activeRole,
  currentPatientId,
  onSaveInvoice,
  onUpdateInvoiceStatus,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Invoice Creation Form State
  const [newPatientId, setNewPatientId] = useState<string>(patients[0]?.id || '');
  const [customPatientName, setCustomPatientName] = useState('');
  const [customPatientPhone, setCustomPatientPhone] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(hospitalSettings.taxRatePercent || 5);
  const [insuranceCovered, setInsuranceCovered] = useState<number>(0);
  const [initialPaymentStatus, setInitialPaymentStatus] = useState<PaymentStatus>('pending');
  const [initialPaymentMethod, setInitialPaymentMethod] = useState<PaymentMethod>('cash');
  const [invoiceItems, setInvoiceItems] = useState<Array<Omit<InvoiceItem, 'id' | 'total'>>>([
    {
      description: 'Specialist Doctor Consultation',
      descriptionBn: 'বিশেষজ্ঞ ডাক্তার কনসালটেশন',
      category: 'consultation',
      quantity: 1,
      unitPrice: 1000,
    },
    {
      description: 'Diagnostic Lab Test (Routine)',
      descriptionBn: 'রুটিন ডায়াগনস্টিক টেস্ট',
      category: 'lab',
      quantity: 1,
      unitPrice: 850,
    }
  ]);

  // Payment Modal State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bkash');
  const [paymentTxnRef, setPaymentTxnRef] = useState<string>('');

  // Filtered invoices based on role:
  const relevantInvoices = activeRole === 'patient' && currentPatientId
    ? invoices.filter((inv) => inv.patientId === currentPatientId)
    : invoices;

  const filteredInvoices = relevantInvoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientPhone.includes(searchQuery) ||
      (inv.doctorName && inv.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Financial Stats
  const totalBilled = relevantInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCollected = relevantInvoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalDue = relevantInvoices.reduce((acc, curr) => acc + curr.dueAmount, 0);
  const pendingCount = relevantInvoices.filter((inv) => inv.status === 'pending').length;

  // Add Item to creation form
  const handleAddItem = () => {
    setInvoiceItems((prev) => [
      ...prev,
      {
        description: 'Hospital Service / Medicine',
        descriptionBn: 'হাসপাতাল সেবা / ওষুধ',
        category: 'medicine',
        quantity: 1,
        unitPrice: 500,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setInvoiceItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Submit New Invoice
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId);
    const doc = doctors.find((d) => d.id === selectedDoctorId);

    const fullItems: InvoiceItem[] = invoiceItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: item.description,
      descriptionBn: item.descriptionBn,
      category: item.category,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
    }));

    const subtotal = fullItems.reduce((acc, curr) => acc + curr.total, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (taxableAmount * taxPercent) / 100;
    const grossTotal = taxableAmount + taxAmount;
    const totalAmount = Math.max(0, grossTotal - insuranceCovered);

    const paidAmount = initialPaymentStatus === 'paid' ? totalAmount : 0;
    const dueAmount = totalAmount - paidAmount;

    const newInvoice: Invoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      patientId: pat?.id || `walkin-${Date.now()}`,
      patientName: customPatientName.trim() || pat?.name || 'Walk-in Patient',
      patientPhone: customPatientPhone.trim() || pat?.phone || '+880 1700-000000',
      patientAge: pat?.age || 35,
      patientGender: pat?.gender || 'male',
      doctorId: doc?.id,
      doctorName: doc?.name,
      departmentName: doc?.specialty,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: fullItems,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      insuranceCovered,
      totalAmount,
      paidAmount,
      dueAmount,
      status: initialPaymentStatus,
      paymentMethod: initialPaymentMethod,
      notes: 'Generated via Hospital Central Billing Desk',
    };

    onSaveInvoice(newInvoice);
    setIsCreateModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Open Payment Modal
  const handleOpenPayment = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPaymentAmount(inv.dueAmount);
    setPaymentTxnRef(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    const newPaidAmount = payingInvoice.paidAmount + paymentAmount;
    const newStatus: PaymentStatus =
      newPaidAmount >= payingInvoice.totalAmount ? 'paid' : 'partial';

    onUpdateInvoiceStatus(
      payingInvoice.id,
      newPaidAmount,
      newStatus,
      selectedPaymentMethod
    );

    setPayingInvoice(null);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  // Generate Official PDF with jsPDF
  const handleDownloadInvoicePdf = (inv: Invoice) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const hospitalName = language === 'bn'
      ? (hospitalSettings.hospitalNameBn || hospitalSettings.hospitalName)
      : hospitalSettings.hospitalName;

    // Header Background banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 38, 'F');

    // Title & Hospital Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(hospitalName, 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`${hospitalSettings.address} | Hotline: ${hospitalSettings.hotline}`, 14, 23);
    doc.text(`Official Medical Care Invoice & Cash Receipt`, 14, 29);

    // Invoice Meta Right-aligned
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text(`INVOICE: ${inv.id}`, 140, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(`Issue Date: ${inv.date}`, 140, 23);
    doc.text(`Due Date: ${inv.dueDate}`, 140, 29);

    // Patient & Doctor Info Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(14, 44, 182, 32, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 44, 182, 32, 2, 2, 'S');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Patient Details:`, 18, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Name: ${inv.patientName} (${inv.patientAge}y, ${inv.patientGender})`, 18, 59);
    doc.text(`Mobile: ${inv.patientPhone}`, 18, 65);
    doc.text(`Patient ID: ${inv.patientId}`, 18, 71);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Consultant / Department:`, 110, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Doctor: ${inv.doctorName || 'Hospital Clinical Service'}`, 110, 59);
    doc.text(`Department: ${inv.departmentName || 'General Healthcare'}`, 110, 65);
    doc.text(`Payment Status: ${inv.status.toUpperCase()}`, 110, 71);

    // Table Header
    let startY = 84;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, startY, 182, 8, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.line(14, startY + 8, 196, startY + 8);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('SL', 18, startY + 5.5);
    doc.text('SERVICE / ITEM DESCRIPTION', 32, startY + 5.5);
    doc.text('QTY', 125, startY + 5.5);
    doc.text('UNIT PRICE', 145, startY + 5.5);
    doc.text('TOTAL (BDT)', 175, startY + 5.5);

    // Line Items
    let currentY = startY + 14;
    inv.items.forEach((item, index) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);

      doc.text(String(index + 1), 18, currentY);
      doc.text(item.description, 32, currentY);
      doc.text(String(item.quantity), 128, currentY);
      doc.text(item.unitPrice.toFixed(2), 145, currentY);
      doc.text(item.total.toFixed(2), 175, currentY);

      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 3, 196, currentY + 3);
      currentY += 8;
    });

    // Summary calculation breakdown box
    const summaryY = currentY + 6;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(120, summaryY, 76, 52, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(120, summaryY, 76, 52, 2, 2, 'S');

    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Subtotal:', 124, summaryY + 7);
    doc.text(`BDT ${inv.subtotal.toFixed(2)}`, 168, summaryY + 7);

    doc.text(`Discount (${inv.discountPercent}%):`, 124, summaryY + 14);
    doc.text(`- BDT ${inv.discountAmount.toFixed(2)}`, 168, summaryY + 14);

    doc.text(`Govt VAT/Tax (${inv.taxPercent}%):`, 124, summaryY + 21);
    doc.text(`+ BDT ${inv.taxAmount.toFixed(2)}`, 168, summaryY + 21);

    if (inv.insuranceCovered > 0) {
      doc.text('Insurance Coverage:', 124, summaryY + 28);
      doc.text(`- BDT ${inv.insuranceCovered.toFixed(2)}`, 168, summaryY + 28);
    }

    // Grand Total
    doc.setDrawColor(203, 213, 225);
    doc.line(124, summaryY + 33, 192, summaryY + 33);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Total Payable:', 124, summaryY + 39);
    doc.text(`BDT ${inv.totalAmount.toFixed(2)}`, 165, summaryY + 39);

    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129); // green
    doc.text('Paid Amount:', 124, summaryY + 45);
    doc.text(`BDT ${inv.paidAmount.toFixed(2)}`, 168, summaryY + 45);

    doc.setTextColor(225, 29, 72); // rose
    doc.text('Due Balance:', 124, summaryY + 50);
    doc.text(`BDT ${inv.dueAmount.toFixed(2)}`, 168, summaryY + 50);

    // Paid Stamp or Due Stamp on PDF
    if (inv.status === 'paid') {
      doc.setDrawColor(16, 185, 129);
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.roundedRect(24, summaryY + 6, 48, 18, 3, 3, 'S');
      doc.text('PAID IN FULL', 28, summaryY + 18);
    } else {
      doc.setDrawColor(225, 29, 72);
      doc.setTextColor(225, 29, 72);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.roundedRect(24, summaryY + 8, 52, 20, 3, 3, 'S');
      doc.text(`DUE: BDT ${inv.dueAmount.toFixed(0)}`, 28, summaryY + 21);
    }

    // Signatures
    const bottomY = 250;
    doc.setDrawColor(203, 213, 225);
    doc.line(20, bottomY, 70, bottomY);
    doc.line(140, bottomY, 190, bottomY);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Prepared by Billing Cashier', 24, bottomY + 5);
    doc.text('Authorized Medical Officer', 144, bottomY + 5);

    // Footer notice
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Computer generated receipt. Valid with hospital security stamp. For billing inquiries call: ${hospitalSettings.hotline}`, 14, 275);

    doc.save(`${inv.id}_${inv.patientName.replace(/\s+/g, '_')}_Bill.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Financial Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'মডিউল ৪: হাসপাতাল বিলিং ও সেন্ট্রাল ইনভয়েস সিস্টেম' : 'Module 4: Central Hospital Billing & Invoicing'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? 'বিলিং ও ক্যাশ কাউন্টার হাব' : 'Hospital Billing & Financial Center'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {language === 'bn'
                ? 'ডাক্তার ভিজিট, বেড চার্জ, ল্যাব পরীক্ষা ও অপারেশনের ডিজিটাল বিল তৈরি, অনলাইন পেমেন্ট এবং ৩ সেকেন্ডে অফিসিয়াল পিডিএফ রিসিপ্ট প্রিন্ট।'
                : 'Generate digital patient bills, track payments, accept bKash/Cards, and export print-ready hospital receipts.'}
            </p>
          </div>

          {/* Action button: Create Bill */}
          {activeRole !== 'patient' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন বিল তৈরি করুন' : 'Create New Patient Bill'}</span>
            </button>
          )}
        </div>

        {/* 4 Financial Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">{language === 'bn' ? 'মোট বিল ভলিউম' : 'Total Invoiced'}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {hospitalSettings.currency} {totalBilled.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {relevantInvoices.length} {language === 'bn' ? 'টি ইনভয়েস ইস্যু' : 'invoices recorded'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">{language === 'bn' ? 'সংগৃহীত পেমেন্ট' : 'Total Paid'}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {hospitalSettings.currency} {totalCollected.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {((totalCollected / (totalBilled || 1)) * 100).toFixed(0)}% {language === 'bn' ? 'কালেকশন হার' : 'recovery rate'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">{language === 'bn' ? 'বকেয়া পরিমাণ' : 'Outstanding Due'}</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600">
              {hospitalSettings.currency} {totalDue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {pendingCount} {language === 'bn' ? 'টি ইনভয়েস বকেয়া' : 'unpaid bills'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">{language === 'bn' ? 'গড় বিল সাইজ' : 'Average Bill'}</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {hospitalSettings.currency} {relevantInvoices.length ? Math.round(totalBilled / relevantInvoices.length).toLocaleString() : 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {language === 'bn' ? 'প্রতি রোগী গড় হিসাব' : 'per patient charge'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'ইনভয়েস আইডি, রোগী বা মোবাইল খুঁজুন...' : 'Search invoice ID, patient or phone...'}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden lg:inline">
            <Filter className="w-3.5 h-3.5 inline mr-1" />
            {language === 'bn' ? 'ফিল্টার:' : 'Filter:'}
          </span>
          {(['all', 'paid', 'pending', 'partial'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap capitalize ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? (language === 'bn' ? 'সবগুলো' : 'All')
                : st === 'paid'
                ? (language === 'bn' ? 'পরিশোধিত' : 'Paid')
                : st === 'pending'
                ? (language === 'bn' ? 'বকেয়া' : 'Pending')
                : (language === 'bn' ? 'আংশিক' : 'Partial')}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'হাসপাতাল ইনভয়েস রেকর্ড' : 'Hospital Invoices Master Register'}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredInvoices.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {activeRole === 'patient'
              ? (language === 'bn' ? 'আপনার ব্যক্তিগত বিল' : 'Your personal bills')
              : (language === 'bn' ? 'হাসপাতালের সকল রোগীর রেজিস্টার' : 'All admitted/OPD patients')}
          </span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-sm font-bold text-slate-600">
              {language === 'bn' ? 'কোনো ইনভয়েস পাওয়া যায়নি' : 'No invoices found matching criteria'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'ইনভয়েস নং' : 'Invoice ID'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'রোগীর বিবরণ' : 'Patient Info'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'ডাক্তার / সার্ভিস' : 'Doctor / Department'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'মোট বিল' : 'Total'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'পরিশোধিত' : 'Paid'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'বকেয়া' : 'Due'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inv.patientPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{inv.doctorName || 'Clinical OPD'}</div>
                      <div className="text-[11px] text-slate-500">{inv.departmentName || 'General'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {hospitalSettings.currency} {inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">
                      {hospitalSettings.currency} {inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      {inv.dueAmount > 0 ? `${hospitalSettings.currency} ${inv.dueAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'partial'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {inv.status === 'paid' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {inv.status === 'partial' && <Clock className="w-3 h-3 text-amber-600" />}
                        {inv.status === 'pending' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                        <span>{inv.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* View Modal */}
                      <button
                        onClick={() => setSelectedInvoiceForView(inv)}
                        title="View Details"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all inline-flex items-center"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      {/* Download PDF */}
                      <button
                        onClick={() => handleDownloadInvoicePdf(inv)}
                        title="Download / Print PDF Receipt"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-slate-700 border border-slate-200 transition-all inline-flex items-center"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Pay Online / Due Payment */}
                      {inv.dueAmount > 0 && (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs inline-flex items-center gap-1 transition-all"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>{language === 'bn' ? 'পেমেন্ট' : 'Pay'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW INVOICE MODAL */}
      {selectedInvoiceForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in">
            <button
              onClick={() => setSelectedInvoiceForView(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {language === 'bn' ? 'অফিসিয়াল ইনভয়েস বিবরণ' : 'Official Hospital Bill'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-mono">
                  {selectedInvoiceForView.id}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">{language === 'bn' ? 'ইস্যু তারিখ' : 'Issue Date'}:</span>
                <p className="text-xs font-bold text-slate-800 font-mono">{selectedInvoiceForView.date}</p>
              </div>
            </div>

            {/* Patient & Doctor Card */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mb-4">
              <div>
                <span className="text-slate-500 font-medium">{language === 'bn' ? 'রোগীর নাম:' : 'Patient:'}</span>
                <p className="font-bold text-slate-900">{selectedInvoiceForView.patientName}</p>
                <p className="text-slate-500 font-mono text-[11px]">{selectedInvoiceForView.patientPhone}</p>
                <p className="text-slate-500 text-[11px]">{selectedInvoiceForView.patientAge}y, {selectedInvoiceForView.patientGender}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{language === 'bn' ? 'কনসালটেন্ট / বিভাগ:' : 'Consultant / Dept:'}</span>
                <p className="font-bold text-slate-900">{selectedInvoiceForView.doctorName || 'Hospital Services'}</p>
                <p className="text-slate-500 text-[11px]">{selectedInvoiceForView.departmentName || 'Clinical'}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">{language === 'bn' ? 'বিবরণ' : 'Description'}</th>
                    <th className="p-2.5 text-center">{language === 'bn' ? 'পরিমাণ' : 'Qty'}</th>
                    <th className="p-2.5 text-right">{language === 'bn' ? 'একক মূল্য' : 'Rate'}</th>
                    <th className="p-2.5 text-right">{language === 'bn' ? 'মোট' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoiceForView.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-2.5 font-medium text-slate-800">{it.description}</td>
                      <td className="p-2.5 text-center text-slate-600 font-mono">{it.quantity}</td>
                      <td className="p-2.5 text-right text-slate-600 font-mono">{hospitalSettings.currency} {it.unitPrice}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 font-mono">{hospitalSettings.currency} {it.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Breakdown */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1.5 text-xs text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                <span className="font-mono text-slate-900">{hospitalSettings.currency} {selectedInvoiceForView.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? `ডিসকাউন্ট (${selectedInvoiceForView.discountPercent}%):` : `Discount (${selectedInvoiceForView.discountPercent}%):`}</span>
                <span className="font-mono text-emerald-600">- {hospitalSettings.currency} {selectedInvoiceForView.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? `ভ্যাট/ট্যাক্স (${selectedInvoiceForView.taxPercent}%):` : `Tax (${selectedInvoiceForView.taxPercent}%):`}</span>
                <span className="font-mono text-slate-900">+ {hospitalSettings.currency} {selectedInvoiceForView.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
                <span className="font-mono">{hospitalSettings.currency} {selectedInvoiceForView.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600">
                <span>{language === 'bn' ? 'পরিশোধিত:' : 'Paid:'}</span>
                <span className="font-mono">{hospitalSettings.currency} {selectedInvoiceForView.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-600">
                <span>{language === 'bn' ? 'বকেয়া পরিমাণ:' : 'Due Balance:'}</span>
                <span className="font-mono">{hospitalSettings.currency} {selectedInvoiceForView.dueAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleDownloadInvoicePdf(selectedInvoiceForView)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পিডিএফ প্রিন্ট করুন' : 'Print PDF Receipt'}</span>
              </button>
              {selectedInvoiceForView.dueAmount > 0 && (
                <button
                  onClick={() => {
                    const inv = selectedInvoiceForView;
                    setSelectedInvoiceForView(null);
                    handleOpenPayment(inv);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'বকেয়া পরিশোধ করুন' : 'Pay Due Balance'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-xl relative animate-in fade-in">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
                <Receipt className="w-3 h-3 text-emerald-600" />
                <span>{language === 'bn' ? 'নতুন রোগী বিলিং কাউন্টার' : 'New Patient Invoice'}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'bn' ? 'নতুন মেডিকেল ইনভয়েস তৈরি করুন' : 'Generate New Hospital Bill'}
              </h3>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
              {/* Patient Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'নিবন্ধিত রোগী নির্বাচন' : 'Select Registered Patient'}
                  </label>
                  <select
                    value={newPatientId}
                    onChange={(e) => {
                      setNewPatientId(e.target.value);
                      const p = patients.find((pat) => pat.id === e.target.value);
                      if (p) {
                        setCustomPatientName(p.name);
                        setCustomPatientPhone(p.phone);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.phone} - {p.bloodGroup})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'অথবা রোগীর নাম (ম্যানুয়াল)' : 'Or Patient Name (Walk-in)'}
                  </label>
                  <input
                    type="text"
                    value={customPatientName}
                    onChange={(e) => setCustomPatientName(e.target.value)}
                    placeholder="e.g. Rahima Khatun"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'কনসালটেন্ট ডাক্তার' : 'Attending Doctor'}
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={customPatientPhone}
                    onChange={(e) => setCustomPatientPhone(e.target.value)}
                    placeholder="+880 1711-000000"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Line Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {language === 'bn' ? 'বিলিং আইটেম ও সেবাসমূহ' : 'Billable Items & Services'}
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'আইটেম যোগ করুন' : 'Add Item'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {invoiceItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                          placeholder="Service description"
                          className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900 text-center"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(index, 'unitPrice', Number(e.target.value))}
                          placeholder="Unit Price"
                          className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900 text-right"
                        />
                      </div>
                      <div className="w-24 text-right font-bold text-slate-900 font-mono text-xs">
                        {hospitalSettings.currency} {(item.quantity * item.unitPrice).toFixed(0)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={invoiceItems.length === 1}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adjustments: Discount, Tax, Insurance */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {language === 'bn' ? 'ডিসকাউন্ট (%)' : 'Discount (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {language === 'bn' ? 'ভ্যাট/ট্যাক্স (%)' : 'Tax (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {language === 'bn' ? 'প্রাথমিক স্ট্যাটাস' : 'Payment Status'}
                  </label>
                  <select
                    value={initialPaymentStatus}
                    onChange={(e) => setInitialPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs text-slate-900"
                  >
                    <option value="pending">{language === 'bn' ? 'বকেয়া (Pending)' : 'Pending (Unpaid)'}</option>
                    <option value="paid">{language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid in Full'}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  {language === 'bn' ? 'বিল ইস্যু সম্পন্ন করুন' : 'Issue & Save Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ONLINE PAYMENT MODAL */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in">
            <button
              onClick={() => setPayingInvoice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {language === 'bn' ? 'অনলাইন বিল পেমেন্ট কাউন্টার' : 'Hospital Payment Gateway'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {payingInvoice.id} {language === 'bn' ? 'এর বকেয়া পরিশোধ' : 'Bill Clearance'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {payingInvoice.patientName} • {language === 'bn' ? 'বকেয়া:' : 'Due:'} {hospitalSettings.currency} {payingInvoice.dueAmount}
              </p>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Gateway'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bkash', 'card', 'cash'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center uppercase ${
                        selectedPaymentMethod === method
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'পরিশোধের পরিমাণ' : 'Payment Amount'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={payingInvoice.dueAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'ট্রানজেকশন রেফারেন্স নং' : 'Txn Reference ID'}
                </label>
                <input
                  type="text"
                  value={paymentTxnRef}
                  onChange={(e) => setPaymentTxnRef(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all mt-2"
              >
                {language === 'bn' ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm & Generate Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
