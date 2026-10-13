import React, { useState } from 'react';
import {
  Search,
  Stethoscope,
  Clock,
  Award,
  CalendarCheck,
  Star,
  MapPin,
  Filter,
  Phone,
  Sparkles
} from 'lucide-react';
import { DoctorItem } from '../../types/patientModule';

interface DoctorSearchProps {
  doctors: DoctorItem[];
  onSelectDoctorForBooking: (doctor: DoctorItem) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({
  doctors,
  onSelectDoctorForBooking,
}) => {
  const [searchName, setSearchName] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Extract unique specializations
  const specializations = ['All', ...Array.from(new Set(doctors.map((d) => d.specialization)))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesName =
      doc.name.toLowerCase().includes(searchName.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchName.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
    return matchesName && matchesSpecialty;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Search Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Clinical Directory
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Find Specialist Doctor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse top hospital physicians, consultants, and surgeons by doctor name or medical specialization.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
            Available Specialists: <span className="font-bold text-teal-700">{filteredDoctors.length}</span> of {doctors.length}
          </div>
        </div>

        {/* Search by Doctor Name and Specialization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Search by Doctor Name */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search doctor by name (e.g. Dr. Ahmed Rahman, Dr. Fatima)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-2xs"
            />
            {searchName && (
              <button
                onClick={() => setSearchName('')}
                className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search by Specialization dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all cursor-pointer font-medium"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === 'All' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specialization Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec === 'All' ? 'All Specialists' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid (Matches Example in prompt) */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No doctors matched your search criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try checking spelling or reset your specialization filter to find other active consultants.
          </p>
          <button
            onClick={() => {
              setSearchName('');
              setSelectedSpecialty('All');
            }}
            className="mt-2 px-4 py-1.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.doctor_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between group"
            >
              {/* Doctor Card Header */}
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={doctor.avatar_url}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {doctor.specialization}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 mt-0.5 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating || 4.9}</span>
                      <span className="text-slate-400 font-normal">(Verified Consultant)</span>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown (Experience, Available Time, Consultation Fee) */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-600" />
                      <span>Experience:</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {doctor.experience_years} Years
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Available Time:</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {doctor.available_time}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>Chamber:</span>
                    </span>
                    <span className="text-slate-700 truncate max-w-[140px]">
                      {doctor.room_no || 'OPD Block A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Consultation Fee:</span>
                    <span className="font-black text-teal-700 text-sm font-mono">
                      ৳ {doctor.consultation_fee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Appointment Button */}
              <button
                onClick={() => onSelectDoctorForBooking(doctor)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
