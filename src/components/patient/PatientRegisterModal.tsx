import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Droplet,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { BloodGroup, PatientAccount, PatientGender } from '../../types/patientModule';
import { evaluatePasswordStrength, hashPassword, PatientDB } from '../../services/patientService';

interface PatientRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegister: (patient: PatientAccount) => void;
  onSwitchToLogin: () => void;
}

export const PatientRegisterModal: React.FC<PatientRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessRegister,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male' as PatientGender,
    blood_group: 'O+' as BloodGroup,
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdPatient, setCreatedPatient] = useState<PatientAccount | null>(null);

  if (!isOpen) return null;

  const passwordStrength = evaluatePasswordStrength(formData.password);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.dob = 'Date of birth must be in the past';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+() -]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (e.g. 01712-345678)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Residential address is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Register via service (saves to local database and syncs with backend)
      const newPatient = await PatientDB.registerPatient({
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        blood_group: formData.blood_group,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        plainPassword: formData.password,
      });

      // Also notify backend API asynchronously
      fetch('/api/patient/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          gender: formData.gender,
          blood_group: formData.blood_group,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          password: formData.password,
        }),
      }).catch(() => {
        // Fallback already handled in PatientDB
      });

      setCreatedPatient(newPatient);
      setSuccessMessage(`Account registered successfully! Assigned Patient ID: ${newPatient.patient_id}`);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrors({ form: err.message || 'Registration failed. Please check details.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full my-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-teal-700 to-emerald-600 px-6 py-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 block">
                Hospital Information System (HIS)
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                New Patient Registration
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {successMessage && createdPatient ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Registration Complete!</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your medical record profile has been securely created in the hospital database.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Patient ID:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{createdPatient.patient_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-800">{createdPatient.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-700">{createdPatient.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Blood Group:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {createdPatient.blood_group}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onSuccessRegister(createdPatient)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Go to Patient Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {errors.form && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Row 1: Full Name & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahim Uddin"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                      errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                      errors.dob ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.dob && <p className="text-[11px] text-rose-600 mt-1">{errors.dob}</p>}
              </div>
            </div>

            {/* Row 2: Gender & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as PatientGender })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Droplet className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value as BloodGroup })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer font-bold"
                  >
                    <option value="A+">A+ (A Positive)</option>
                    <option value="A-">A- (A Negative)</option>
                    <option value="B+">B+ (B Positive)</option>
                    <option value="B-">B- (B Negative)</option>
                    <option value="AB+">AB+ (AB Positive)</option>
                    <option value="AB-">AB- (AB Negative)</option>
                    <option value="O+">O+ (O Positive)</option>
                    <option value="O-">O- (O Negative)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Phone Number & Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 01712-345678"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                      errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahim@carepulse.hospital"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                      errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Row 4: Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Residential Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House #42, Road #7, Dhanmondi, Dhaka"
                  className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                    errors.address ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'
                  }`}
                />
              </div>
              {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
            </div>

            {/* Row 5: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                      errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}

                {/* Password Strength Meter */}
                {formData.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Strength:</span>
                      <span className="font-bold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                      errors.confirmPassword
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-300 focus:border-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Patient Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Patient Account</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2 text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-teal-600 hover:text-teal-700 font-bold hover:underline"
              >
                Sign in to Patient Portal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
