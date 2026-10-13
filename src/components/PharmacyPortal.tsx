import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Building2,
  CalendarDays, Check, CheckCircle2, ClipboardList, CreditCard, Download,
  FileText, LayoutDashboard, LogOut, Menu, Package, Pill, Plus, Printer,
  Search, ShieldAlert, ShieldCheck, Truck, UserRound, Wallet, X,
} from 'lucide-react';
import { INITIAL_PATIENTS } from '../data/hospitalData';

type Section = 'overview' | 'inventory' | 'prescriptions' | 'dispensing' | 'purchases' | 'suppliers' | 'transfers' | 'expiry' | 'returns' | 'billing' | 'analytics' | 'notifications' | 'profile';
type ModalKind = 'medicine' | 'purchase' | 'supplier' | 'transfer' | 'return' | 'dispense';
type PrescriptionStatus = 'Pending' | 'Verified' | 'Partially dispensed' | 'Dispensed' | 'Completed';
type PurchaseStatus = 'Requested' | 'Approved' | 'Ordered' | 'Received';
type Medicine = {
  id: string; name: string; generic: string; brand: string; category: string; manufacturer: string;
  batch: string; quantity: number; unitPrice: number; expiry: string; manufactured: string;
  location: string; reorderAt: number; interactions: string[];
};
type PrescriptionItem = { medicine: string; dose: string; frequency: string; duration: string; quantity: number; instruction: string };
type Prescription = { id: string; patientId: string; patient: string; doctor: string; department: string; date: string; items: PrescriptionItem[]; status: PrescriptionStatus };
type DispenseRecord = { id: string; prescriptionId: string; patientId: string; patient: string; medicine: string; quantity: number; batch: string; date: string; pharmacist: string; amount: number; status: string };
type PurchaseOrder = { id: string; supplier: string; medicine: string; quantity: number; unitCost: number; delivery: string; invoice: string; status: PurchaseStatus };
type Supplier = { id: string; name: string; company: string; phone: string; address: string; products: string; payable: number; payment: string };
type ReturnRequest = { id: string; patient: string; invoice: string; medicine: string; quantity: number; reason: string; refund: number; status: string };
type StockTransfer = { id: string; department: string; medicine: string; quantity: number; sender: string; receiver: string; status: string };
type PharmacyNotification = { id: number; title: string; detail: string; time: string; read: boolean; tone: string };

interface PharmacyPortalProps {
  name: string;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onLogout: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);
const money = (amount: number) => `৳${Math.round(amount).toLocaleString('en-BD')}`;
const medicineCategories = ['Antibiotic', 'Pain Killer', 'Injection', 'Syrup', 'Tablet', 'Capsule', 'IV Fluid', 'Medical Equipment'];
const purchaseStatuses: PurchaseStatus[] = ['Requested', 'Approved', 'Ordered', 'Received'];
const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const primaryButton = 'inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800';

const initialMedicines: Medicine[] = [
  { id: 'MED-1001', name: 'Paracetamol 500 mg', generic: 'Paracetamol', brand: 'Napa', category: 'Pain Killer', manufacturer: 'Beximco Pharma', batch: 'NPA-26-041', quantity: 420, unitPrice: 2, expiry: '2027-08-31', manufactured: '2026-02-01', location: 'Main pharmacy · Shelf A1', reorderAt: 100, interactions: ['Warfarin'] },
  { id: 'MED-1002', name: 'Amoxicillin 500 mg', generic: 'Amoxicillin', brand: 'Moxacil', category: 'Antibiotic', manufacturer: 'Square Pharmaceuticals', batch: 'MXL-26-022', quantity: 55, unitPrice: 12, expiry: '2027-03-15', manufactured: '2026-03-15', location: 'Main pharmacy · Shelf B2', reorderAt: 80, interactions: ['Methotrexate', 'Warfarin'] },
  { id: 'MED-1003', name: 'Insulin Glargine 100 IU/ml', generic: 'Insulin glargine', brand: 'Lantus', category: 'Injection', manufacturer: 'Sanofi Bangladesh', batch: 'LNT-26-009', quantity: 8, unitPrice: 920, expiry: '2026-11-30', manufactured: '2026-01-10', location: 'Cold storage · Fridge C1', reorderAt: 15, interactions: ['Beta-blockers'] },
  { id: 'MED-1004', name: 'Ceftriaxone 1 g injection', generic: 'Ceftriaxone', brand: 'Trizon', category: 'Injection', manufacturer: 'Healthcare Pharmaceuticals', batch: 'TRZ-25-118', quantity: 36, unitPrice: 180, expiry: '2026-11-02', manufactured: '2025-11-02', location: 'Main pharmacy · Shelf C4', reorderAt: 20, interactions: ['Warfarin'] },
  { id: 'MED-1005', name: 'Omeprazole 20 mg', generic: 'Omeprazole', brand: 'Seclo', category: 'Capsule', manufacturer: 'Square Pharmaceuticals', batch: 'SCL-26-061', quantity: 280, unitPrice: 6, expiry: '2028-01-31', manufactured: '2026-01-31', location: 'Main pharmacy · Shelf A3', reorderAt: 80, interactions: ['Clopidogrel'] },
  { id: 'MED-1006', name: 'Saline 0.9% 500 ml', generic: 'Sodium chloride', brand: 'Normal Saline', category: 'IV Fluid', manufacturer: 'Popular Pharmaceuticals', batch: 'NS-26-033', quantity: 95, unitPrice: 85, expiry: '2027-04-20', manufactured: '2026-04-20', location: 'IV storage · Rack D1', reorderAt: 30, interactions: [] },
  { id: 'MED-1007', name: 'Atorvastatin 10 mg', generic: 'Atorvastatin', brand: 'Lipitor', category: 'Tablet', manufacturer: 'Pfizer', batch: 'LPT-25-411', quantity: 14, unitPrice: 22, expiry: '2027-01-15', manufactured: '2025-07-15', location: 'Main pharmacy · Shelf A5', reorderAt: 60, interactions: ['Clarithromycin', 'Grapefruit'] },
  { id: 'MED-1008', name: 'Azithromycin 250 mg', generic: 'Azithromycin', brand: 'Zimax', category: 'Antibiotic', manufacturer: 'Incepta Pharmaceuticals', batch: 'ZMX-26-088', quantity: 60, unitPrice: 28, expiry: '2026-10-20', manufactured: '2025-10-20', location: 'Main pharmacy · Shelf B1', reorderAt: 40, interactions: ['Warfarin', 'Aluminum antacids'] },
  { id: 'MED-1009', name: 'Cetirizine 10 mg', generic: 'Cetirizine', brand: 'Alatrol', category: 'Tablet', manufacturer: 'Square Pharmaceuticals', batch: 'ALT-24-008', quantity: 0, unitPrice: 4, expiry: '2026-03-31', manufactured: '2024-03-31', location: 'Quarantine · expired batch', reorderAt: 50, interactions: ['Alcohol', 'Sedatives'] },
];

const initialPrescriptions: Prescription[] = [
  { id: 'RX-26041', patientId: 'pat-1', patient: 'Rahat Chowdhury', doctor: 'Prof. Dr. M. A. Rashid', department: 'Cardiology & Heart Center', date: today(), status: 'Pending', items: [{ medicine: 'Amoxicillin 500 mg', dose: '500 mg', frequency: '3 times daily', duration: '5 days', quantity: 15, instruction: 'Take after meals' }, { medicine: 'Paracetamol 500 mg', dose: '500 mg', frequency: 'As needed · max 4/day', duration: '3 days', quantity: 8, instruction: 'For fever or pain' }] },
  { id: 'RX-26042', patientId: 'pat-2', patient: 'Shamima Nasrin', doctor: 'Dr. Farhana Yasmin', department: 'Neurology & Brain Sciences', date: today(), status: 'Pending', items: [{ medicine: 'Paracetamol 500 mg', dose: '500 mg', frequency: '3 times daily', duration: '3 days', quantity: 9, instruction: 'Take after food' }, { medicine: 'Atorvastatin 10 mg', dose: '10 mg', frequency: 'Once daily at night', duration: '30 days', quantity: 30, instruction: 'Review with prescribing clinician if unavailable' }] },
  { id: 'RX-26043', patientId: 'pat-3', patient: 'Aayan Ahmed', doctor: 'Dr. Tahmina Akter', department: 'Pediatrics & Child Health', date: today(), status: 'Verified', items: [{ medicine: 'Paracetamol 500 mg', dose: '250 mg', frequency: 'Every 6 hours as needed', duration: '3 days', quantity: 6, instruction: 'Pediatric dose as prescribed' }, { medicine: 'Cetirizine 10 mg', dose: '5 mg', frequency: 'Once daily', duration: '5 days', quantity: 5, instruction: 'Pediatric dose as prescribed' }] },
  { id: 'RX-26044', patientId: 'pat-4', patient: 'Abdul Malek', doctor: 'Dr. Shahriar Kabir', department: 'Orthopedics & Spine Surgery', date: today(), status: 'Partially dispensed', items: [{ medicine: 'Ceftriaxone 1 g injection', dose: '1 g', frequency: 'Twice daily', duration: '3 days', quantity: 6, instruction: 'Administer by clinical staff only' }, { medicine: 'Omeprazole 20 mg', dose: '20 mg', frequency: 'Once daily', duration: '7 days', quantity: 7, instruction: 'Before breakfast' }] },
];

const initialSuppliers: Supplier[] = [
  { id: 'SUP-001', name: 'MedSupply Bangladesh Ltd.', company: 'MedSupply Bangladesh Ltd.', phone: '+880 1711-223344', address: 'Tejgaon Industrial Area, Dhaka', products: 'Injectables, IV fluids', payable: 42500, payment: 'Payment due' },
  { id: 'SUP-002', name: 'Square Pharmaceuticals', company: 'Square Pharmaceuticals PLC', phone: '+880 1812-334455', address: 'Mohakhali, Dhaka', products: 'Antibiotics, tablets', payable: 18600, payment: 'Payment due' },
  { id: 'SUP-003', name: 'HealthTech Diagnostics', company: 'HealthTech Diagnostics', phone: '+880 1913-445566', address: 'Dhanmondi, Dhaka', products: 'Cold-chain medicines', payable: 0, payment: 'Current' },
];
const initialPurchases: PurchaseOrder[] = [
  { id: 'PO-2026-041', supplier: 'MedSupply Bangladesh Ltd.', medicine: 'Insulin Glargine 100 IU/ml', quantity: 30, unitCost: 820, delivery: '2026-10-17', invoice: 'SUP-INV-8891', status: 'Approved' },
  { id: 'PO-2026-040', supplier: 'Square Pharmaceuticals', medicine: 'Amoxicillin 500 mg', quantity: 200, unitCost: 9, delivery: '2026-10-15', invoice: 'SUP-INV-8875', status: 'Ordered' },
  { id: 'PO-2026-039', supplier: 'HealthTech Diagnostics', medicine: 'Ceftriaxone 1 g injection', quantity: 100, unitCost: 145, delivery: '2026-10-14', invoice: 'SUP-INV-8820', status: 'Requested' },
];
const initialDispenses: DispenseRecord[] = [
  { id: 'DSP-6108', prescriptionId: 'RX-26039', patientId: 'pat-2', patient: 'Shamima Nasrin', medicine: 'Omeprazole 20 mg', quantity: 14, batch: 'SCL-26-061', date: today(), pharmacist: 'Pharmacy Desk', amount: 84, status: 'Billed' },
  { id: 'DSP-6107', prescriptionId: 'RX-26038', patientId: 'pat-1', patient: 'Rahat Chowdhury', medicine: 'Paracetamol 500 mg', quantity: 10, batch: 'NPA-26-041', date: today(), pharmacist: 'Pharmacy Desk', amount: 20, status: 'Billed' },
];
const initialReturns: ReturnRequest[] = [
  { id: 'RET-2026-012', patient: 'Aayan Ahmed', invoice: 'PH-INV-88102', medicine: 'Paracetamol 500 mg', quantity: 2, reason: 'Unopened pack returned after dose change', refund: 4, status: 'Requested' },
];
const initialTransfers: StockTransfer[] = [
  { id: 'TRF-2026-023', department: 'ICU', medicine: 'Saline 0.9% 500 ml', quantity: 12, sender: 'Central Pharmacy', receiver: 'ICU Store · Nurse In-charge', status: 'Requested' },
  { id: 'TRF-2026-022', department: 'Emergency', medicine: 'Paracetamol 500 mg', quantity: 20, sender: 'Central Pharmacy', receiver: 'Emergency Unit', status: 'Approved' },
];
const initialNotifications: PharmacyNotification[] = [
  { id: 1, title: 'Prescription received', detail: 'RX-26041 · Rahat Chowdhury · 2 medicines', time: '4 min ago', read: false, tone: 'blue' },
  { id: 2, title: 'Low stock: Insulin Glargine', detail: '8 units remaining · reorder threshold 15', time: '15 min ago', read: false, tone: 'amber' },
  { id: 3, title: 'Expiry approaching', detail: 'Azithromycin batch ZMX-26-088 · 7 days', time: '25 min ago', read: false, tone: 'rose' },
  { id: 4, title: 'Purchase approval', detail: 'PO-2026-041 · Insulin Glargine · approved', time: '1 hr ago', read: true, tone: 'teal' },
  { id: 5, title: 'Medicine return request', detail: 'RET-2026-012 · awaiting pharmacy review', time: '2 hr ago', read: true, tone: 'amber' },
];

const navigation: { id: Section; label: string; icon: typeof Pill }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }, { id: 'inventory', label: 'Medicine Inventory', icon: Package },
  { id: 'prescriptions', label: 'Prescription Queue', icon: FileText }, { id: 'dispensing', label: 'Dispensing', icon: Pill },
  { id: 'purchases', label: 'Purchase Management', icon: ClipboardList }, { id: 'suppliers', label: 'Supplier Management', icon: Truck },
  { id: 'transfers', label: 'Stock Transfer', icon: Building2 }, { id: 'expiry', label: 'Expiry Alert', icon: CalendarDays },
  { id: 'returns', label: 'Medicine Return', icon: ArrowDownRight }, { id: 'billing', label: 'Billing Integration', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: Activity }, { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export function PharmacyPortal({ name, language, onToggleLanguage, onLogout }: PharmacyPortalProps) {
  const [section, setSection] = useState<Section>('overview');
  const [medicines, setMedicines] = useState(initialMedicines);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [dispenses, setDispenses] = useState(initialDispenses);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [returns, setReturns] = useState(initialReturns);
  const [transfers, setTransfers] = useState(initialTransfers);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState('');
  const [medicineFilter, setMedicineFilter] = useState('All stock');
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedReturnId, setSelectedReturnId] = useState('');
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const lowStock = medicines.filter((item) => item.quantity > 0 && item.quantity <= item.reorderAt);
  const expiredMedicines = medicines.filter((item) => item.quantity > 0 && item.expiry < today());
  const expiringSoon = medicines.filter((item) => item.quantity > 0 && item.expiry >= today() && (new Date(item.expiry).getTime() - Date.now()) / 86400000 <= 30);
  const pendingPrescriptions = prescriptions.filter((item) => ['Pending', 'Verified', 'Partially dispensed'].includes(item.status));
  const pendingPurchases = purchases.filter((item) => ['Requested', 'Approved', 'Ordered'].includes(item.status)).length;
  const unread = notifications.filter((item) => !item.read).length;
  const filteredMedicines = useMemo(() => medicines.filter((item) => {
    const queryMatch = `${item.id} ${item.name} ${item.generic} ${item.brand} ${item.batch} ${item.manufacturer}`.toLowerCase().includes(search.toLowerCase());
    const stockMatch = medicineFilter === 'All stock' || (medicineFilter === 'Available' && item.quantity > item.reorderAt) || (medicineFilter === 'Low stock' && item.quantity > 0 && item.quantity <= item.reorderAt) || (medicineFilter === 'Out of stock' && item.quantity === 0) || (medicineFilter === 'Expired' && item.expiry < today());
    return queryMatch && stockMatch;
  }), [medicines, search, medicineFilter]);
  const filteredPrescriptions = useMemo(() => prescriptions.filter((item) => `${item.id} ${item.patient} ${item.patientId} ${item.doctor} ${item.department} ${item.items.map((medicine) => medicine.medicine).join(' ')}`.toLowerCase().includes(search.toLowerCase())), [prescriptions, search]);
  const totalDispensedToday = dispenses.filter((item) => item.date === today()).reduce((sum, item) => sum + item.quantity, 0);
  const dispensingRevenue = dispenses.reduce((sum, item) => sum + item.amount, 0);

  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4500);
  };
  const goTo = (id: Section) => {
    setSection(id);
    setSearch('');
    setMobileNavOpen(false);
  };
  const updateMedicine = (id: string, amount: number) => setMedicines((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item));

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const suffix = String(Date.now()).slice(-5);
    if (modal === 'medicine') {
      const quantity = Number(value('quantity'));
      const price = Number(value('unitPrice'));
      if (quantity < 0 || price < 0) {
        toast('Quantity and unit price must not be negative.');
        return;
      }
      setMedicines((current) => [{ id: `MED-${suffix}`, name: value('name'), generic: value('generic'), brand: value('brand'), category: value('category'), manufacturer: value('manufacturer'), batch: value('batch'), quantity, unitPrice: price, expiry: value('expiry'), manufactured: value('manufactured'), location: value('location'), reorderAt: Number(value('reorderAt')), interactions: [] }, ...current]);
      toast('Medicine batch added to pharmacy inventory.');
    } else if (modal === 'purchase') {
      const quantity = Number(value('quantity'));
      const unitCost = Number(value('unitCost'));
      if (quantity <= 0 || unitCost < 0) {
        toast('Enter a positive purchase quantity and a valid unit cost.');
        return;
      }
      setPurchases((current) => [{ id: `PO-${new Date().getFullYear()}-${suffix}`, supplier: value('supplier'), medicine: value('medicine'), quantity, unitCost, delivery: value('delivery'), invoice: value('invoice'), status: 'Requested' }, ...current]);
      toast('Purchase request submitted for approval.');
    } else if (modal === 'supplier') {
      setSuppliers((current) => [{ id: `SUP-${suffix}`, name: value('name'), company: value('company'), phone: value('phone'), address: value('address'), products: value('products'), payable: Number(value('payable') || 0), payment: Number(value('payable') || 0) > 0 ? 'Payment due' : 'Current' }, ...current]);
      toast('Supplier added to the pharmacy directory.');
    } else if (modal === 'transfer') {
      const quantity = Number(value('quantity'));
      const medicine = medicines.find((item) => item.id === value('medicineId'));
      if (!medicine || quantity <= 0 || quantity > medicine.quantity) {
        toast('Select a medicine and enter a transfer quantity within available stock.');
        return;
      }
      setTransfers((current) => [{ id: `TRF-${new Date().getFullYear()}-${suffix}`, department: value('department'), medicine: medicine.name, quantity, sender: 'Central Pharmacy', receiver: value('receiver'), status: 'Requested' }, ...current]);
      toast('Stock transfer request submitted to the receiving department.');
    } else if (modal === 'return') {
      const quantity = Number(value('quantity'));
      const medicine = value('medicine');
      const stockItem = medicines.find((item) => item.name === medicine);
      if (!stockItem || quantity <= 0) {
        toast('Choose a valid medicine and enter a return quantity greater than zero.');
        return;
      }
      setReturns((current) => [{ id: `RET-${new Date().getFullYear()}-${suffix}`, patient: value('patient'), invoice: value('invoice'), medicine, quantity, reason: value('reason'), refund: quantity * stockItem.unitPrice, status: 'Requested' }, ...current]);
      toast('Medicine return request submitted for review.');
    }
    setModal(null);
  };

  const runSafetyCheck = (prescription: Prescription) => {
    const patient = INITIAL_PATIENTS.find((item) => item.id === prescription.patientId);
    const allergies = patient?.allergies ?? [];
    const allergyMatches = prescription.items.flatMap((item) => {
      const generic = medicines.find((med) => med.name === item.medicine)?.generic ?? item.medicine;
      return allergies.filter((allergy) => generic.toLowerCase().includes(allergy.toLowerCase()) || (allergy.toLowerCase().includes('penicillin') && /amoxicillin|ampicillin|penicillin/i.test(generic)));
    });
    const missing = prescription.items.filter((line) => !medicines.some((medicine) => medicine.name === line.medicine));
    const unavailable = prescription.items.filter((line) => {
      const medicine = medicines.find((item) => item.name === line.medicine);
      return !medicine || medicine.quantity < line.quantity || medicine.expiry < today();
    });
    const interactions = prescription.items.flatMap((line) => {
      const medicine = medicines.find((item) => item.name === line.medicine);
      return (medicine?.interactions ?? []).filter((interaction) => prescription.items.some((other) => other.medicine !== line.medicine && other.medicine.toLowerCase().includes(interaction.toLowerCase())));
    });
    return { allergyMatches: Array.from(new Set(allergyMatches)), missing, unavailable, interactions };
  };

  const verifyPrescription = (prescription: Prescription) => {
    const safety = runSafetyCheck(prescription);
    if (safety.allergyMatches.length || safety.missing.length || safety.unavailable.length) {
      const reasons = [
        safety.allergyMatches.length ? `allergy match: ${safety.allergyMatches.join(', ')}` : '',
        safety.missing.length ? `unlisted medicine: ${safety.missing.map((line) => line.medicine).join(', ')}` : '',
        safety.unavailable.length ? `unavailable, expired or insufficient stock: ${safety.unavailable.map((line) => line.medicine).join(', ')}` : '',
      ].filter(Boolean).join('; ');
      setNotifications((current) => [{ id: Date.now(), title: 'Prescription safety hold', detail: `${prescription.id} · ${prescription.patient} · ${reasons}`, time: 'Just now', read: false, tone: 'rose' }, ...current]);
      toast(`Do not dispense ${prescription.id}; prescriber clarification required for ${reasons}.`);
      return;
    }
    setPrescriptions((current) => current.map((item) => item.id === prescription.id ? { ...item, status: 'Verified' } : item));
    if (safety.interactions.length) {
      toast(`Verified. Review potential medicine interaction(s): ${safety.interactions.join(', ')} before dispensing.`);
    } else {
      toast(`${prescription.id} verified. Medicine availability and recorded allergies checked.`);
    }
  };

  const dispensePrescription = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPrescription) return;
    const data = new FormData(event.currentTarget);
    const checkedItems = selectedPrescription.items.filter((_, index) => data.get(`dispense-${index}`) === 'on');
    if (!checkedItems.length) {
      toast('Select at least one prescribed item to dispense.');
      return;
    }
    const safety = runSafetyCheck({ ...selectedPrescription, items: checkedItems });
    if (safety.allergyMatches.length || safety.missing.length || safety.unavailable.length) {
      const reasons = [...safety.allergyMatches.map((item) => `allergy: ${item}`), ...safety.missing.map((item) => `missing: ${item.medicine}`), ...safety.unavailable.map((item) => `stock/expiry issue: ${item.medicine}`)].join('; ');
      setNotifications((current) => [{ id: Date.now(), title: 'Dispensing blocked by safety check', detail: `${selectedPrescription.id} · ${reasons}`, time: 'Just now', read: false, tone: 'rose' }, ...current]);
      toast(`Dispensing stopped. Resolve with the prescribing doctor: ${reasons}.`);
      return;
    }
    const dispenseRows = checkedItems.map((line) => {
      const stockItem = medicines.find((item) => item.name === line.medicine)!;
      const quantity = line.quantity;
      return { id: `DSP-${String(Date.now()).slice(-5)}-${Math.random().toString(36).slice(2, 4)}`, prescriptionId: selectedPrescription.id, patientId: selectedPrescription.patientId, patient: selectedPrescription.patient, medicine: line.medicine, quantity, batch: stockItem.batch, date: today(), pharmacist: name, amount: quantity * stockItem.unitPrice, status: 'Invoice requested' };
    });
    setMedicines((current) => current.map((medicine) => {
      const used = checkedItems.filter((line) => line.medicine === medicine.name).reduce((sum, line) => sum + line.quantity, 0);
      return used ? { ...medicine, quantity: medicine.quantity - used } : medicine;
    }));
    setDispenses((current) => [...dispenseRows, ...current]);
    const allDone = selectedPrescription.items.every((line) => checkedItems.includes(line) || dispenses.some((row) => row.prescriptionId === selectedPrescription.id && row.medicine === line.medicine));
    setPrescriptions((current) => current.map((item) => item.id === selectedPrescription.id ? { ...item, status: allDone ? 'Dispensed' : 'Partially dispensed' } : item));
    setNotifications((current) => [{ id: Date.now(), title: 'Pharmacy billing request created', detail: `${selectedPrescription.patient} · ${dispenseRows.length} medicine(s) · ${money(dispenseRows.reduce((sum, row) => sum + row.amount, 0))}`, time: 'Just now', read: false, tone: 'teal' }, ...current]);
    toast(`${dispenseRows.length} medicine(s) dispensed; stock updated and billing request created.`);
    setSelectedPrescription(null);
  };

  const updatePurchaseStatus = (purchase: PurchaseOrder, status: PurchaseStatus) => {
    const currentIndex = purchaseStatuses.indexOf(purchase.status);
    if (purchase.status === 'Received' || purchaseStatuses.indexOf(status) !== currentIndex + 1) {
      toast('Purchase orders can only advance one step at a time and cannot be received twice.');
      return;
    }
    setPurchases((current) => current.map((item) => item.id === purchase.id ? { ...item, status } : item));
    if (status === 'Received') {
      const medicine = medicines.find((item) => item.name === purchase.medicine);
      if (medicine) updateMedicine(medicine.id, purchase.quantity);
      else {
        const suffix = String(Date.now()).slice(-4);
        setMedicines((current) => [{ id: `MED-${suffix}`, name: purchase.medicine, generic: purchase.medicine, brand: purchase.medicine, category: 'Tablet', manufacturer: purchase.supplier, batch: `PO-${suffix}`, quantity: purchase.quantity, unitPrice: purchase.unitCost * 1.2, expiry: '2027-12-31', manufactured: today(), location: 'Goods receiving · Quarantine', reorderAt: 20, interactions: [] }, ...current]);
      }
      toast(`${purchase.id} received. Inventory quantity updated; quarantine/QA checks still required before dispensing.`);
    } else {
      toast(`${purchase.id} status updated to ${status}.`);
    }
  };

  const updateReturn = (request: ReturnRequest, status: string) => {
    const allowed = request.status === 'Requested' ? ['Approved', 'Rejected'] : request.status === 'Approved' ? ['Completed', 'Rejected'] : [];
    if (!allowed.includes(status)) {
      toast('Return requests must be reviewed before completion; returned stock is never automatically restocked.');
      return;
    }
    setReturns((current) => current.map((item) => item.id === request.id ? { ...item, status } : item));
    toast(`${request.id} updated to ${status}; finance approval is required for any refund posting.`);
  };
  const updateTransfer = (transfer: StockTransfer, status: string) => {
    const allowed = transfer.status === 'Requested' ? ['Approved', 'Rejected'] : transfer.status === 'Approved' ? ['Transferred', 'Rejected'] : [];
    if (!allowed.includes(status)) {
      toast('Transfer requests must follow the request, approval, and transfer workflow.');
      return;
    }
    if (status === 'Transferred') {
      const medicine = medicines.find((item) => item.name === transfer.medicine);
      if (!medicine || medicine.quantity < transfer.quantity) {
        toast(`Transfer not completed: insufficient stock for ${transfer.medicine}.`);
        return;
      }
      updateMedicine(medicine.id, -transfer.quantity);
    }
    setTransfers((current) => current.map((item) => item.id === transfer.id ? { ...item, status } : item));
    toast(`${transfer.id} transfer status updated to ${status}.`);
  };

  const exportCsv = () => {
    const rows = dispenses.map((item) => ({ dispensing: item.id, prescription: item.prescriptionId, patient: item.patient, medicine: item.medicine, quantity: item.quantity, batch: item.batch, date: item.date, amount_bdt: item.amount, billing_status: item.status }));
    if (!rows.length) {
      toast('No dispensing records are available for export.');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => `"${String(row[header as keyof typeof row]).replaceAll('"', '""')}"`).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `carepulse-pharmacy-report-${today()}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Excel-compatible pharmacy report downloaded.');
  };

  const currentTitle = navigation.find((item) => item.id === section)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 lg:flex">
      <aside className={`${mobileNavOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-[276px] overflow-y-auto bg-[#10283f] text-white transition-transform lg:sticky lg:top-0 lg:h-screen`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500"><Pill className="h-5 w-5" /></div><div><p className="font-black tracking-wide">CarePulse</p><p className="text-xs text-slate-400">Pharmacy Services</p></div><button onClick={() => setMobileNavOpen(false)} className="ml-auto lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button></div>
        <div className="mx-4 my-4 rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Pharmacy workspace</p><p className="mt-1 text-sm font-semibold">Central Pharmacy · Shift A</p><p className="mt-1 text-xs text-teal-300">● On duty</p></div>
        <nav className="space-y-1 px-3 pb-4">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => goTo(id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${section === id ? 'bg-teal-500 text-white shadow-lg shadow-teal-950/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-[17px] w-[17px] shrink-0" /><span className="flex-1">{label}</span>{id === 'notifications' && unread > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold">{unread}</span>}{id === 'expiry' && expiredMedicines.length + expiringSoon.length > 0 && <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold">{expiredMedicines.length + expiringSoon.length}</span>}</button>)}</nav>
        <div className="border-t border-white/10 p-3"><div className="mb-3 flex items-center gap-2 px-3 py-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-xs font-bold">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="min-w-0"><p className="truncate text-xs font-semibold">{name}</p><p className="text-[10px] text-slate-400">Pharmacist</p></div></div><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button></div>
      </aside>
      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileNavOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div className="min-w-0"><p className="hidden text-xs text-slate-500 sm:block">{new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-BD', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h1 className="truncate text-lg font-bold sm:text-xl">{currentTitle}</h1></div></div>
          <div className="flex items-center gap-2"><button onClick={onToggleLanguage} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">{language === 'en' ? 'বাংলা' : 'EN'}</button><button onClick={() => goTo('notifications')} className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600" aria-label="Notifications"><Bell className="h-4 w-4" />{unread > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{unread}</span>}</button><div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold sm:flex"><ShieldCheck className="h-4 w-4 text-teal-700" />Pharmacy Staff</div></div>
        </header>

        <div className="mx-auto max-w-[1480px] space-y-6 p-4 sm:p-6 lg:p-8">
          {section === 'overview' && <>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-teal-700">Good day, {name}</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Pharmacy dashboard</h2><p className="mt-1 text-sm text-slate-500">Prescription queue, stock health, safety checks and dispensing activity.</p></div><button onClick={() => goTo('prescriptions')} className={primaryButton}><ClipboardList className="h-4 w-4" />Open prescription queue</button></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Total medicines" value={String(medicines.length)} detail="Tracked batch records" icon={Package} tone="blue" /><Metric label="Available stock" value={medicines.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} detail="Units across batches" icon={Pill} tone="teal" /><Metric label="Low stock" value={String(lowStock.length)} detail="Reorder threshold reached" icon={ArrowDownRight} tone="amber" /><Metric label="Expired medicines" value={String(expiredMedicines.length)} detail="Quarantined / dispose" icon={AlertTriangle} tone="rose" /><Metric label="Pending prescriptions" value={String(pendingPrescriptions.length)} detail="Awaiting verification or fill" icon={FileText} tone="violet" /><Metric label="Dispensed today" value={String(totalDispensedToday)} detail={`${dispenses.filter((item) => item.date === today()).length} line items`} icon={CheckCircle2} tone="green" /><Metric label="Purchase requests" value={String(pendingPurchases)} detail="Approval / delivery in progress" icon={Truck} tone="blue" /><Metric label="Medicine returns" value={String(returns.filter((item) => ['Requested', 'Approved'].includes(item.status)).length)} detail="Awaiting review / completion" icon={ArrowDownRight} tone="amber" /></div>
            <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-bold">Daily dispensing activity</h3><p className="mt-1 text-xs text-slate-500">Sample medicine issues · last 7 days</p></div><span className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">This week</span></div><div className="mt-6 grid h-48 grid-cols-7 items-end gap-4 border-b border-l border-slate-100 px-3 pb-2">{[42, 66, 58, 82, 70, 100, 75].map((height, index) => <div key={index} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex h-[85%] w-full items-end justify-center"><span style={{ height: `${height}%` }} className="w-5 rounded-t bg-teal-500 sm:w-7" /></div><span className="text-[10px] text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span></div>)}</div><p className="mt-3 text-xs text-slate-400">Chart is representative demo activity; connect sales history for live series.</p></section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="font-bold">Stock movement</h3><p className="mt-1 text-xs text-slate-500">Demo monthly movement index</p><div className="mt-5 space-y-4">{[['Dispensed', 78, 'text-teal-600'], ['Received', 54, 'text-blue-600'], ['Returned / wastage', 18, 'text-amber-600']].map(([label, percent, color]) => <div key={String(label)}><div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><span className="text-slate-500">{percent}%</span></div><div className="h-2 rounded-full bg-slate-100"><div style={{ width: `${percent}%` }} className={`h-2 rounded-full bg-current ${color}`} /></div></div>)}</div><div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><b>{expiringSoon.length} batches</b> expire within 30 days. Review near-expiry stock before dispensing.</div></section>
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title="Prescription priority queue" subtitle="Prescriptions that need pharmacy review" action={<button onClick={() => goTo('prescriptions')} className="text-sm font-semibold text-teal-700">View queue →</button>} /><PrescriptionTable prescriptions={pendingPrescriptions.slice(0, 4)} onVerify={verifyPrescription} onDispense={(item) => { setSelectedPrescription(item); setModal('dispense'); }} /></section>
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title="Safety & stock alerts" subtitle="Resolve before dispensing or replenishment" /><div className="divide-y divide-slate-100">{[...expiredMedicines.map((item) => ({ key: item.id, title: `Expired batch · ${item.name}`, detail: `${item.batch} · expired ${item.expiry} · quarantined`, tone: 'rose' })), ...lowStock.map((item) => ({ key: `${item.id}-stock`, title: `Low stock · ${item.name}`, detail: `${item.quantity} units remaining · reorder at ${item.reorderAt}`, tone: 'amber' }))].slice(0, 5).map((alert) => <div key={alert.key} className="flex gap-3 p-4"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${alert.tone === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}><AlertTriangle className="h-4 w-4" /></span><div><p className="text-sm font-semibold">{alert.title}</p><p className="mt-1 text-xs text-slate-500">{alert.detail}</p></div></div>)}</div></section>
            </div>
          </>}

          {section === 'inventory' && <Records title="Medicine inventory" subtitle="Batch-level stock, expiry, storage, pricing and stock history." search={search} onSearch={setSearch} action={<button onClick={() => setModal('medicine')} className={primaryButton}><Plus className="h-4 w-4" />Add medicine</button>}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">{filteredMedicines.length} batch records · {medicines.reduce((sum, item) => sum + item.quantity, 0)} total units</p><select value={medicineFilter} onChange={(event) => setMedicineFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{['All stock', 'Available', 'Low stock', 'Out of stock', 'Expired'].map((filter) => <option key={filter}>{filter}</option>)}</select></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Medicine / generic', 'Brand / category', 'Manufacturer / batch', 'Stock', 'Unit price', 'Expiry / storage', 'Stock status', 'Adjust'].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredMedicines.map((item) => <tr key={item.id}><td className="px-4 py-3"><b>{item.name}</b><p className="mt-1 text-xs text-slate-500">{item.generic} · {item.id}</p></td><td className="px-4 py-3">{item.brand}<p className="mt-1 text-xs text-slate-500">{item.category}</p></td><td className="px-4 py-3">{item.manufacturer}<p className="mt-1 text-xs text-slate-500">{item.batch} · Mfg {item.manufactured}</p></td><td className="px-4 py-3 font-semibold">{item.quantity}</td><td className="px-4 py-3">{money(item.unitPrice)}</td><td className="px-4 py-3">{item.expiry}<p className="mt-1 text-xs text-slate-500">{item.location}</p></td><td className="px-4 py-3"><StatusPill status={item.expiry < today() ? 'Expired' : item.quantity <= item.reorderAt ? 'Low stock' : 'Available'} /></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => { const change = Number(window.prompt('Stock adjustment (+ receive / - issue)', '0')); if (Number.isFinite(change) && change !== 0 && item.quantity + change >= 0) { updateMedicine(item.id, change); toast(`${item.name} adjusted by ${change}; adjustment logged locally.`); } else if (Number.isFinite(change) && change !== 0) toast('Stock cannot be adjusted below zero.'); }} className="rounded border border-slate-200 px-2 py-1 text-xs">Adjust</button></div></td></tr>)}</tbody></table>{filteredMedicines.length === 0 && <EmptyState />}</div>
          </Records>}

          {section === 'prescriptions' && <Records title="Doctor prescription queue" subtitle="View read-only orders, run allergy/stock checks and verify before dispensing." search={search} onSearch={setSearch}><PrescriptionTable prescriptions={filteredPrescriptions} onVerify={verifyPrescription} onDispense={(item) => { setSelectedPrescription({ ...item, items: item.items.filter((line) => !dispenses.some((row) => row.prescriptionId === item.id && row.medicine === line.medicine)) }); setModal('dispense'); }} /></Records>}

          {section === 'dispensing' && <Records title="Dispensing history" subtitle="Completed medicine issues, pharmacist, batch, and billing hand-off." search={search} onSearch={setSearch} action={<button onClick={() => window.print()} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"><Printer className="h-4 w-4" />Print report</button>}><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Dispensing ID', 'Prescription', 'Patient', 'Medicine', 'Qty / Batch', 'Date / pharmacist', 'Amount', 'Billing'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{dispenses.filter((row) => `${row.id} ${row.prescriptionId} ${row.patient} ${row.patientId} ${row.medicine} ${row.batch}`.toLowerCase().includes(search.toLowerCase())).map((row) => <tr key={row.id}><td className="px-4 py-3 font-semibold">{row.id}</td><td className="px-4 py-3">{row.prescriptionId}</td><td className="px-4 py-3">{row.patient}<p className="text-xs text-slate-500">{row.patientId}</p></td><td className="px-4 py-3">{row.medicine}</td><td className="px-4 py-3">{row.quantity}<p className="text-xs text-slate-500">{row.batch}</p></td><td className="px-4 py-3">{row.date}<p className="text-xs text-slate-500">{row.pharmacist}</p></td><td className="px-4 py-3 font-semibold">{money(row.amount)}</td><td className="px-4 py-3"><StatusPill status={row.status} /></td></tr>)}</tbody></table></div></Records>}

          {section === 'purchases' && <Records title="Purchase management" subtitle="Request, approve, order and receive medicine purchases." action={<button onClick={() => setModal('purchase')} className={primaryButton}><Plus className="h-4 w-4" />Create purchase request</button>}><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Purchase order', 'Supplier', 'Medicine', 'Qty / unit cost', 'Delivery', 'Supplier invoice', 'Status', 'Update'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{purchases.map((order) => <tr key={order.id}><td className="px-4 py-3 font-semibold">{order.id}</td><td className="px-4 py-3">{order.supplier}</td><td className="px-4 py-3">{order.medicine}</td><td className="px-4 py-3">{order.quantity}<p className="text-xs text-slate-500">{money(order.unitCost)} / unit</p></td><td className="px-4 py-3">{order.delivery}</td><td className="px-4 py-3">{order.invoice}</td><td className="px-4 py-3"><StatusPill status={order.status} /></td><td className="px-4 py-3"><select value={order.status} onChange={(event) => updatePurchaseStatus(order, event.target.value as PurchaseStatus)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs">{purchaseStatuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></Records>}

          {section === 'suppliers' && <Records title="Supplier management" subtitle="Supplier contacts, supplied categories, purchase and payable status." action={<button onClick={() => setModal('supplier')} className={primaryButton}><Plus className="h-4 w-4" />Add supplier</button>}><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Supplier / company', 'Contact / address', 'Products', 'Pending payment', 'Status', 'Purchase orders'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{suppliers.map((supplier) => <tr key={supplier.id}><td className="px-4 py-3 font-semibold">{supplier.name}<p className="mt-1 text-xs text-slate-500">{supplier.company}</p></td><td className="px-4 py-3">{supplier.phone}<p className="mt-1 text-xs text-slate-500">{supplier.address}</p></td><td className="px-4 py-3">{supplier.products}</td><td className="px-4 py-3 font-semibold">{money(supplier.payable)}</td><td className="px-4 py-3"><StatusPill status={supplier.payment} /></td><td className="px-4 py-3">{purchases.filter((item) => item.supplier === supplier.name).length}</td></tr>)}</tbody></table></div></Records>}

          {section === 'transfers' && <Records title="Stock transfer management" subtitle="Route pharmacy stock to ICU, emergency, operation theatre and wards." action={<button onClick={() => setModal('transfer')} className={primaryButton}><Plus className="h-4 w-4" />New transfer</button>}><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Transfer', 'Department', 'Medicine', 'Qty', 'Sender → receiver', 'Approval', 'Update'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{transfers.map((item) => <tr key={item.id}><td className="px-4 py-3 font-semibold">{item.id}</td><td className="px-4 py-3">{item.department}</td><td className="px-4 py-3">{item.medicine}</td><td className="px-4 py-3">{item.quantity}</td><td className="px-4 py-3">{item.sender}<p className="text-xs text-slate-500">→ {item.receiver}</p></td><td className="px-4 py-3"><StatusPill status={item.status} /></td><td className="px-4 py-3"><select value={item.status} onChange={(event) => updateTransfer(item, event.target.value)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs"><option>Requested</option><option>Approved</option><option>Rejected</option><option>Transferred</option></select></td></tr>)}</tbody></table></div></Records>}

          {section === 'expiry' && <div className="grid gap-5 xl:grid-cols-2"><section className="overflow-hidden rounded-2xl border border-rose-200 bg-white"><PanelHeading title="Expired / quarantine" subtitle="Never dispense an expired batch." /><BatchTable items={medicines.filter((item) => item.expiry < today())} tone="rose" onDispose={(item) => { setMedicines((current) => current.map((medicine) => medicine.id === item.id ? { ...medicine, quantity: 0, location: 'Disposed · quarantine log' } : medicine)); toast(`${item.batch} disposal recorded; stock removed from available balance.`); }} /></section><section className="overflow-hidden rounded-2xl border border-amber-200 bg-white"><PanelHeading title="Expiring within 30 days" subtitle="Prioritize FEFO (first-expiry-first-out) allocation." /><BatchTable items={expiringSoon} tone="amber" onDispose={(item) => { setMedicines((current) => current.map((medicine) => medicine.id === item.id ? { ...medicine, quantity: 0, location: 'Disposed · quarantine log' } : medicine)); toast(`${item.batch} disposal recorded.`); }} /></section></div>}

          {section === 'returns' && <Records title="Medicine returns" subtitle="Review returned items; refund posting remains with authorized billing staff." action={<button onClick={() => setModal('return')} className={primaryButton}><Plus className="h-4 w-4" />New return request</button>}><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Return ID', 'Patient / invoice', 'Medicine', 'Qty / reason', 'Refund estimate', 'Status', 'Review'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{returns.map((item) => <tr key={item.id}><td className="px-4 py-3 font-semibold">{item.id}</td><td className="px-4 py-3">{item.patient}<p className="text-xs text-slate-500">{item.invoice}</p></td><td className="px-4 py-3">{item.medicine}</td><td className="px-4 py-3">{item.quantity}<p className="text-xs text-slate-500">{item.reason}</p></td><td className="px-4 py-3 font-semibold">{money(item.refund)}</td><td className="px-4 py-3"><StatusPill status={item.status} /></td><td className="px-4 py-3"><select value={item.status} onChange={(event) => updateReturn(item, event.target.value)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs"><option>Requested</option><option>Approved</option><option>Rejected</option><option>Completed</option></select></td></tr>)}</tbody></table></div><p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Only sealed, eligible products may be returned under hospital policy. Completed status records stock disposition; authorized Finance staff must approve and process any refund.</p></Records>}

          {section === 'billing' && <Records title="Pharmacy billing integration" subtitle="Dispensed prescription items create pharmacy billing requests for the Accountant portal."><div className="mb-4 grid gap-3 sm:grid-cols-3"><InfoTile label="Dispensed value" value={money(dispensingRevenue)} /><InfoTile label="Invoice requests" value={String(dispenses.filter((item) => item.status === 'Invoice requested').length)} /><InfoTile label="Billed line items" value={String(dispenses.filter((item) => item.status === 'Billed').length)} /></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Request', 'Prescription / patient', 'Medicine', 'Quantity', 'Date', 'Amount', 'Payment status'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{dispenses.map((row) => <tr key={row.id}><td className="px-4 py-3 font-semibold">{row.id}</td><td className="px-4 py-3">{row.prescriptionId}<p className="text-xs text-slate-500">{row.patient} · {row.patientId}</p></td><td className="px-4 py-3">{row.medicine}</td><td className="px-4 py-3">{row.quantity}</td><td className="px-4 py-3">{row.date}</td><td className="px-4 py-3 font-semibold">{money(row.amount)}</td><td className="px-4 py-3"><StatusPill status={row.status} /></td></tr>)}</tbody></table></div><p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Demo hand-off only: pharmacy requests are not synchronized to accountant invoices or patient billing accounts.</p></Records>}

          {section === 'analytics' && <section className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Pharmacy analytics</h2><p className="mt-1 text-sm text-slate-500">Consumption, dispensing revenue, purchasing and expiry indicators.</p></div><button onClick={exportCsv} className={primaryButton}><Download className="h-4 w-4" />Export CSV</button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Medicine consumption" value={String(totalDispensedToday)} detail="Units dispensed today" icon={Pill} tone="blue" /><Metric label="Dispensing revenue" value={money(dispensingRevenue)} detail="Demo line-item totals" icon={Wallet} tone="teal" /><Metric label="Purchase commitment" value={money(purchases.filter((item) => item.status !== 'Received').reduce((sum, item) => sum + item.quantity * item.unitCost, 0))} detail="Open purchase orders" icon={Truck} tone="violet" /><Metric label="Expiry / wastage risk" value={String(expiredMedicines.length + expiringSoon.length)} detail="Expired or near-expiry batches" icon={AlertTriangle} tone="rose" /></div><div className="grid gap-5 xl:grid-cols-2"><AnalyticsBars title="Most dispensed medicines" data={Object.entries(dispenses.reduce<Record<string, number>>((totals, item) => { totals[item.medicine] = (totals[item.medicine] ?? 0) + item.quantity; return totals; }, {})).map(([label, value]) => ({ label, value }))} /><AnalyticsBars title="Stock by category" data={medicineCategories.map((label) => ({ label, value: medicines.filter((item) => item.category === label).reduce((sum, item) => sum + item.quantity, 0) }))} /></div><p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Analytics are calculated from sample portal state, not live hospital inventory or financial records.</p></section>}

          {section === 'notifications' && <Records title="Pharmacy notifications" subtitle="Prescription, stock, expiry, purchase and return workflow alerts" action={<button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))} className="text-sm font-semibold text-teal-700">Mark all read</button>}><div className="divide-y divide-slate-100">{notifications.map((item) => <div key={item.id} className={`flex items-start gap-3 p-4 ${item.read ? '' : 'bg-teal-50/40'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.tone === 'rose' ? 'bg-rose-500' : item.read ? 'bg-slate-300' : 'bg-teal-500'}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.detail}</p><p className="mt-2 text-xs text-slate-400">{item.time}</p></div>{!item.read && <button onClick={() => setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium">Mark read</button>}</div>)}</div></Records>}

          {section === 'profile' && <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700"><UserRound className="h-7 w-7" /></div><div><h2 className="text-xl font-bold">{name}</h2><p className="text-sm text-slate-500">Pharmacist · Central Pharmacy · Shift A</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><InfoTile label="Prescription queue" value={`${pendingPrescriptions.length} pending`} /><InfoTile label="Role access" value="Inventory & dispensing" /></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>Access boundary</b><p className="mt-1">Prescription details are read-only. This portal cannot edit doctor orders, patient medical histories or financial/billing records.</p></div></section>}

          {notice && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">{notice}</div>}
          <p className="text-xs text-slate-400">Demo pharmacy workspace · stock, prescriptions, dispense and billing request changes are local to this browser session.</p>
        </div>
      </main>

      {modal && <PharmacyModal kind={modal} medicines={medicines} suppliers={suppliers} selectedPrescription={selectedPrescription} onClose={() => { setModal(null); setSelectedPrescription(null); }} onSubmit={modal === 'dispense' ? dispensePrescription : submitForm} safetyCheck={selectedPrescription ? runSafetyCheck(selectedPrescription) : undefined} />}
    </div>
  );
}

function Metric({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Package; tone: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-700', teal: 'bg-teal-50 text-teal-700', amber: 'bg-amber-50 text-amber-700', rose: 'bg-rose-50 text-rose-700', violet: 'bg-violet-50 text-violet-700', green: 'bg-emerald-50 text-emerald-700' };
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></article>;
}
function PanelHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5"><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>{action}</div>;
}
function Records({ title, subtitle, search, onSearch, action, children }: { title: string; subtitle: string; search?: string; onSearch?: (value: string) => void; action?: ReactNode; children: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><PanelHeading title={title} subtitle={subtitle} action={action} />{onSearch && <div className="border-b border-slate-100 p-4"><label className="relative block max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search patient, medicine, batch, order or ID" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500" /></label></div>}<div className="p-4 sm:p-5">{children}</div></section>;
}
function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1.5 text-lg font-bold">{value}</p></div>;
}
function StatusPill({ status }: { status: string }) {
  const value = status.toLowerCase();
  const color = value.includes('expired') || value.includes('reject') || value.includes('blocked') ? 'bg-rose-50 text-rose-700'
    : value.includes('dispensed') || value.includes('received') || value.includes('approved') || value.includes('current') || value.includes('available') || value.includes('completed') || value.includes('billed') ? 'bg-emerald-50 text-emerald-700'
      : value.includes('low') || value.includes('pending') || value.includes('requested') || value.includes('near') || value.includes('approved') || value.includes('ordered') ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-100 text-slate-600';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}>{status}</span>;
}
function PrescriptionTable({ prescriptions, onVerify, onDispense }: { prescriptions: Prescription[]; onVerify: (item: Prescription) => void; onDispense: (item: Prescription) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Prescription / patient', 'Doctor / department', 'Medicine orders', 'Date', 'Status', 'Safety / action'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{prescriptions.map((item) => <tr key={item.id} className="align-top"><td className="px-4 py-3 font-semibold">{item.id}<p className="mt-1 font-medium">{item.patient}</p><p className="text-xs text-slate-500">{item.patientId}</p></td><td className="px-4 py-3">{item.doctor}<p className="mt-1 text-xs text-slate-500">{item.department}</p></td><td className="px-4 py-3">{item.items.map((line) => <p key={line.medicine} className="mb-1 text-xs"><b>{line.medicine}</b> · {line.dose} · {line.frequency} · {line.duration} · Qty {line.quantity}</p>)}</td><td className="px-4 py-3">{item.date}</td><td className="px-4 py-3"><StatusPill status={item.status} /></td><td className="px-4 py-3"><div className="flex flex-wrap gap-1.5">{item.status === 'Pending' && <button onClick={() => onVerify(item)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:border-teal-500">Verify safety</button>}{['Verified', 'Partially dispensed'].includes(item.status) && <button onClick={() => onDispense(item)} className="rounded-md bg-teal-700 px-2.5 py-1.5 text-xs font-semibold text-white">Dispense</button>}</div></td></tr>)}</tbody></table>{prescriptions.length === 0 && <EmptyState />}</div>;
}
function BatchTable({ items, tone, onDispose }: { items: Medicine[]; tone: string; onDispose: (item: Medicine) => void }) {
  return <div className="divide-y divide-slate-100">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.batch} · {item.quantity} units · Expires {item.expiry}</p><p className="mt-1 text-xs text-slate-500">{item.location}</p></div><div className="flex items-center gap-2"><StatusPill status={tone === 'rose' ? 'Expired · quarantine' : 'Near expiry'} /><button onClick={() => onDispose(item)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Record disposal</button></div></div>)}{items.length === 0 && <EmptyState />}</div>;
}
function AnalyticsBars({ title, data }: { title: string; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold">{title}</h3><div className="mt-4 space-y-4">{data.map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs"><span>{item.label}</span><b>{item.value.toLocaleString()}</b></div><div className="h-2 rounded-full bg-slate-100"><div style={{ width: `${Math.max(item.value ? 4 : 0, item.value / max * 100)}%` }} className="h-2 rounded-full bg-teal-500" /></div></div>)}</div></section>;
}
function EmptyState() {
  return <div className="py-10 text-center text-sm text-slate-500">No matching records found.</div>;
}
function PharmacyModal({ kind, medicines, suppliers, selectedPrescription, onClose, onSubmit, safetyCheck }: { kind: ModalKind; medicines: Medicine[]; suppliers: Supplier[]; selectedPrescription: Prescription | null; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; safetyCheck?: { allergyMatches: string[]; missing: PrescriptionItem[]; unavailable: PrescriptionItem[]; interactions: string[] } }) {
  const titles = { medicine: 'Add medicine batch', purchase: 'Create purchase request', supplier: 'Add supplier', transfer: 'Create stock transfer', return: 'Create medicine return', dispense: 'Verify & dispense prescription' };
  const submitLabels = { medicine: 'Add to inventory', purchase: 'Submit request', supplier: 'Save supplier', transfer: 'Submit transfer', return: 'Submit return', dispense: 'Dispense selected medicines' };
  const field = (label: string, name: string, type = 'text', required = true, min?: string) => <label className="block text-sm font-medium">{label}<input name={name} type={type} required={required} min={min ?? (type === 'number' ? '0' : undefined)} step={type === 'number' ? '0.01' : undefined} className={inputClass} /></label>;
  const select = (label: string, name: string, options: string[]) => <label className="block text-sm font-medium">{label}<select name={name} required className={inputClass}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
  return <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="pharmacy-modal-title" className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 id="pharmacy-modal-title" className="font-bold">{titles[kind]}</h2><p className="mt-1 text-xs text-slate-500">Pharmacy demo workflow · changes remain local to this session.</p></div><button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
    <form onSubmit={onSubmit} className="space-y-4 p-5">
      {kind === 'medicine' && <div className="grid gap-4 sm:grid-cols-2">{field('Medicine name', 'name')}{field('Generic name', 'generic')}{field('Brand name', 'brand')}{select('Category', 'category', medicineCategories)}{field('Manufacturer', 'manufacturer')}{field('Batch number', 'batch')}{field('Quantity', 'quantity', 'number')}{field('Unit price (৳)', 'unitPrice', 'number')}{field('Manufacturing date', 'manufactured', 'date')}{field('Expiry date', 'expiry', 'date')}{field('Reorder threshold', 'reorderAt', 'number')}{field('Storage location', 'location')}</div>}
      {kind === 'purchase' && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Supplier<select name="supplier" required className={inputClass}>{suppliers.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>{field('Medicine name', 'medicine')}{field('Quantity', 'quantity', 'number', true, '1')}{field('Unit cost (৳)', 'unitCost', 'number')}{field('Expected delivery date', 'delivery', 'date')}{field('Supplier invoice / quotation', 'invoice')}</div>}
      {kind === 'supplier' && <div className="grid gap-4 sm:grid-cols-2">{field('Supplier name', 'name')}{field('Company name', 'company')}{field('Contact number', 'phone')}{field('Address', 'address')}{field('Supplied products', 'products')}{field('Pending payable (৳)', 'payable', 'number', false)}</div>}
      {kind === 'transfer' && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Medicine / batch<select name="medicineId" required className={inputClass}>{medicines.filter((item) => item.quantity > 0 && item.expiry >= today()).map((item) => <option key={item.id} value={item.id}>{item.name} · {item.batch} · stock {item.quantity}</option>)}</select></label>{select('Department', 'department', ['ICU', 'Emergency', 'Operation Theater', 'Medical Ward', 'Surgical Ward'])}{field('Quantity', 'quantity', 'number', true, '1')}{field('Receiving staff / unit', 'receiver')}</div>}
      {kind === 'return' && <div className="grid gap-4 sm:grid-cols-2">{field('Patient name', 'patient')}{field('Invoice number', 'invoice')}<label className="block text-sm font-medium">Medicine<select name="medicine" required className={inputClass}>{medicines.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>{field('Return quantity', 'quantity', 'number', true, '1')}{field('Reason', 'reason')}</div>}
      {kind === 'dispense' && selectedPrescription && <div className="space-y-4"><div className="rounded-lg bg-slate-50 p-3 text-sm"><b>{selectedPrescription.patient}</b> · {selectedPrescription.patientId}<p className="mt-1 text-xs text-slate-500">{selectedPrescription.id} · {selectedPrescription.doctor} · {selectedPrescription.department}</p></div>
        {!!safetyCheck?.allergyMatches.length && <div className="flex gap-2 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900"><ShieldAlert className="h-5 w-5 shrink-0" /><div><b>Dispensing blocked: patient allergy conflict</b><p className="mt-1 text-xs">Allergy record: {safetyCheck.allergyMatches.join(', ')}. Contact the prescribing doctor; do not substitute or dispense without a corrected prescription.</p></div></div>}
        {!!safetyCheck?.unavailable.length && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><b>Stock / expiry issue</b><p className="mt-1 text-xs">{safetyCheck.unavailable.map((item) => item.medicine).join(', ')} unavailable, expired or has insufficient quantity.</p></div>}
        {!!safetyCheck?.interactions.length && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><b>Potential interaction review</b><p className="mt-1 text-xs">{safetyCheck.interactions.join(', ')}. Confirm with prescribing clinician before dispensing.</p></div>}
        {selectedPrescription.items.map((line, index) => { const stock = medicines.find((item) => item.name === line.medicine); const allergies = INITIAL_PATIENTS.find((patient) => patient.id === selectedPrescription.patientId)?.allergies ?? []; const generic = stock?.generic ?? line.medicine; const allergy = allergies.some((item) => generic.toLowerCase().includes(item.toLowerCase()) || (item.toLowerCase().includes('penicillin') && /amoxicillin|ampicillin|penicillin/i.test(generic))); return <label key={line.medicine} className={`flex items-start gap-3 rounded-xl border p-3 ${allergy ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}><input type="checkbox" name={`dispense-${index}`} defaultChecked={!allergy && !!stock && stock.quantity >= line.quantity && stock.expiry >= today()} disabled={!stock || stock.quantity < line.quantity || stock.expiry < today() || allergy} className="mt-1 h-4 w-4 accent-teal-700" /><span className="min-w-0 flex-1"><b className="text-sm">{line.medicine}</b><span className="block mt-1 text-xs text-slate-500">{line.dose} · {line.frequency} · {line.duration} · Qty {line.quantity} · {line.instruction}</span><span className="mt-1 block text-xs">{stock ? `Batch ${stock.batch} · stock ${stock.quantity} · ${money(stock.unitPrice)}/unit · expires ${stock.expiry}` : 'Not in inventory'}</span></span><StatusPill status={allergy ? 'Allergy block' : stock && stock.quantity >= line.quantity && stock.expiry >= today() ? 'Available' : 'Unavailable'} /></label>; })}
        <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Doctor prescription is read-only. Dispensing decrements batch stock and creates a local invoice request; no patient history or billing record is edited.</p>
      </div>}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button className={primaryButton}><Check className="h-4 w-4" />{submitLabels[kind]}</button></div>
    </form></section></div>;
}
