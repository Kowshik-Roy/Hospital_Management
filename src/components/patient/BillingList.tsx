import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Calendar,
  DollarSign,
  ShieldCheck,
  Loader2,
  Clock,
  Sparkles
} from 'lucide-react';
import { BillingRecord, PatientAccount } from '../../types/patientModule';
import { PatientDB } from '../../services/patientService';

interface BillingListProps {
  patient: PatientAccount;
  bills: BillingRecord[];
  onBillsChange: (updatedBills: BillingRecord[]) => void;
}

export const BillingList: React.FC<BillingListProps> = ({
  patient,
  bills,
  onBillsChange,
}) => {
  const [selectedBillForPay, setSelectedBillForPay] = useState<BillingRecord | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<BillingRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('bKash Digital Payment');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const totalOutstanding = bills
    .filter((b) => b.payment_status === 'Pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaid = bills
    .filter((b) => b.payment_status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillForPay) return;

    setIsProcessingPay(true);
    try {
      const updated = PatientDB.payBill(selectedBillForPay.bill_id, paymentMethod);
      onBillsChange(PatientDB.getBills(patient.patient_id));

      // Call backend API
      fetch(`/api/patient/billing/${selectedBillForPay.bill_id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod }),
      }).catch(() => {});

      setIsProcessingPay(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setSelectedBillForPay(null);
        setPaymentSuccess(false);
      }, 1500);
    } catch (err) {
      setIsProcessingPay(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Billing & Financial Records
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Hospital Billing & Invoices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of doctor fees, lab diagnostic tests, medicine costs, and payment statuses.
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Paid</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">৳ {totalPaid.toLocaleString()}</span>
          </div>

          <div className="flex-1 md:flex-none bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Pending Dues</span>
            <span className="font-mono font-bold text-rose-700 text-sm">৳ {totalOutstanding.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Billing Records Table (Exact fields required by prompt) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {bills.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No invoices generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Invoice Number</th>
                  <th className="py-3.5 px-4">Doctor Consultation Fee</th>
                  <th className="py-3.5 px-4">Test Fee</th>
                  <th className="py-3.5 px-4">Medicine Cost</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Payment Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bills.map((bill) => (
                  <tr key={bill.bill_id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Invoice Number */}
                    <td className="py-4 px-4 font-mono font-bold text-blue-700">
                      {bill.invoice_number}
                    </td>

                    {/* Doctor Consultation Fee */}
                    <td className="py-4 px-4 font-mono text-slate-800">
                      ৳ {bill.doctor_consultation_fee.toLocaleString()}
                    </td>

                    {/* Test Fee */}
                    <td className="py-4 px-4 font-mono text-slate-800">
                      ৳ {bill.test_fee.toLocaleString()}
                    </td>

                    {/* Medicine Cost */}
                    <td className="py-4 px-4 font-mono text-slate-800">
                      ৳ {bill.medicine_cost.toLocaleString()}
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 font-mono font-black text-slate-900 text-sm">
                      ৳ {bill.amount.toLocaleString()}
                    </td>

                    {/* Payment Status (Paid, Pending) */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          bill.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {bill.payment_status === 'Paid' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{bill.payment_status}</span>
                      </span>
                    </td>

                    {/* Payment Date */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {bill.date}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedReceipt(bill)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>

                      {bill.payment_status === 'Pending' && (
                        <button
                          onClick={() => setSelectedBillForPay(bill)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs inline-flex items-center gap-1 transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now</span>
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

      {/* Online Payment Simulation Modal */}
      {selectedBillForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Pay Hospital Invoice</span>
              </div>
              <button
                onClick={() => setSelectedBillForPay(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-600">
                  Your payment of ৳{selectedBillForPay.amount.toLocaleString()} for Invoice #{selectedBillForPay.invoice_number} has been confirmed.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePayNow} className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedBillForPay.invoice_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Payable:</span>
                    <span className="font-mono font-black text-emerald-700 text-base">
                      ৳ {selectedBillForPay.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    {['bKash Digital Payment', 'Nagad Online', 'Visa / Mastercard', 'Hospital Cash Counter'].map(
                      (method) => (
                        <div
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            paymentMethod === method
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {method}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBillForPay(null)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPay}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isProcessingPay ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Formal Cash Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-700 uppercase">
                  CarePulse Hospital Finance Center
                </span>
                <h3 className="text-lg font-black text-slate-900">Hospital Cash Receipt</h3>
                <p className="text-xs text-slate-500 font-mono">Invoice #{selectedReceipt.invoice_number}</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-bold text-slate-900">{patient.name} ({patient.patient_id})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Billing Date:</span>
                <span className="font-mono text-slate-800">{selectedReceipt.date}</span>
              </div>
            </div>

            {/* Fee Itemization */}
            <div className="space-y-2 text-xs border border-slate-200 rounded-2xl p-4">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Doctor Consultation Fee:</span>
                <span className="font-mono font-bold text-slate-900">
                  ৳ {selectedReceipt.doctor_consultation_fee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Diagnostic Laboratory Test Fee:</span>
                <span className="font-mono font-bold text-slate-900">
                  ৳ {selectedReceipt.test_fee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Hospital Pharmacy Medicine Cost:</span>
                <span className="font-mono font-bold text-slate-900">
                  ৳ {selectedReceipt.medicine_cost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 font-black text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-700">
                  ৳ {selectedReceipt.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Status:</span>
              <span
                className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] border ${
                  selectedReceipt.payment_status === 'Paid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {selectedReceipt.payment_status}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Official Computer Generated Hospital Receipt</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
