import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Mail,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { BloodGroup, PatientAccount, PatientGender } from '../../types/patientModule';
import { evaluatePasswordStrength, PatientDB } from '../../services/patientService';

interface PatientProfileProps {
  patient: PatientAccount;
  onUpdatePatient: (updated: PatientAccount) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onUpdatePatient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patient.name,
    phone: patient.phone,
    address: patient.address,
    gender: patient.gender,
    blood_group: patient.blood_group,
    dob: patient.dob,
    avatar_url: patient.avatar_url || '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Change Password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Profile Picture Upload Simulation / Preset Picker
  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  ];

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, avatar_url: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      const updated = await PatientDB.updatePatientProfile(patient.patient_id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        blood_group: formData.blood_group,
        dob: formData.dob,
        avatar_url: formData.avatar_url,
      });

      // Sync backend API
      fetch(`/api/patient/profile/${patient.patient_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          avatar_url: formData.avatar_url,
        }),
      }).catch(() => {});

      onUpdatePatient(updated);
      setIsSaving(false);
      setIsEditing(false);
      setFeedbackMessage({ type: 'success', text: 'Patient profile updated successfully!' });
    } catch (err: any) {
      setIsSaving(false);
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      await PatientDB.changePassword(patient.patient_id, oldPassword, newPassword);

      // Call backend API
      fetch(`/api/patient/change-password/${patient.patient_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      }).catch(() => {});

      setPasswordSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  const newPwStrength = evaluatePasswordStrength(newPassword);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Edit Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Account ID: {patient.patient_id}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Patient Profile Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View and manage your registered identity, contact information, and security credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: patient.name,
                  phone: patient.phone,
                  address: patient.address,
                  gender: patient.gender,
                  blood_group: patient.blood_group,
                  dob: patient.dob,
                  avatar_url: patient.avatar_url || '',
                });
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              Cancel Edit
            </button>
          )}

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Main Profile View / Edit Grid */}
      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Status */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <img
              src={formData.avatar_url || patient.avatar_url}
              alt={patient.name}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg ring-2 ring-teal-500/20"
            />
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md cursor-pointer transition-all">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
            <p className="text-xs text-slate-500">{patient.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              Blood Group: {patient.blood_group}
            </span>
          </div>

          {/* Preset Avatar Selection during Edit */}
          {isEditing && (
            <div className="w-full pt-3 border-t border-slate-100 text-left">
              <span className="text-[11px] font-semibold text-slate-600 block mb-2">
                Or select avatar preset:
              </span>
              <div className="flex items-center justify-center gap-2">
                {avatarPresets.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preset ${i}`}
                    onClick={() => setFormData({ ...formData, avatar_url: url })}
                    className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                      formData.avatar_url === url
                        ? 'border-teal-600 scale-110 shadow-sm'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-xs text-left">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Patient ID:</span>
              <span className="font-mono font-bold text-slate-900">{patient.patient_id}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Status:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Verified</span>
              </span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Registered Since:</span>
              <span className="font-mono text-slate-700">{patient.created_at || '2026-01-10'}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>Personal & Medical Profile Details</span>
            </h3>
            {isEditing && (
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Edit Mode Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              ) : (
                <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                  {patient.name}
                </div>
              )}
            </div>

            {/* Email Address (Readonly for security) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-[10px] text-slate-400 font-normal">(Primary Identifier)</span>
              </label>
              <div className="bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between">
                <span>{patient.email}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-teal-600 font-bold">*</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-mono"
                />
              ) : (
                <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800">
                  {patient.phone}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-mono"
                />
              ) : (
                <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-800">
                  {patient.dob}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as PatientGender })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                  {patient.gender}
                </div>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              {isEditing ? (
                <select
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value as BloodGroup })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white cursor-pointer font-bold"
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
              ) : (
                <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-rose-600 font-mono">
                  {patient.blood_group}
                </div>
              )}
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Residential Address <span className="text-teal-600 font-bold">*</span>
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            ) : (
              <div className="bg-slate-50 px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed">
                {patient.address}
              </div>
            )}
          </div>

          {/* Save Button if Editing */}
          {isEditing && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>Change Password</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPw ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password (e.g. Patient@123)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPw(!showOldPw)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password (min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 pr-9 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {newPassword.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Strength: {newPwStrength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full ${
                            step <= newPwStrength.score ? newPwStrength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
