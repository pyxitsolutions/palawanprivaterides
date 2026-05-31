import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { X, Calendar, Clock, MapPin, Users, MessageSquare, Car, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { PolicyModal, type PolicyType } from './PolicyModal';
import { getTourExtraFees } from '../utils/pricing';

const EMAILJS_SERVICE_ID = 'service_w5vk124';
const EMAILJS_TEMPLATE_RIDES = 'template_pnxzs9s';
const EMAILJS_TEMPLATE_TOURS = 'template_vxsclk9';
const EMAILJS_PUBLIC_KEY = 'RaznTonJuUEVxkdZp';

interface PricingTier {
  vehicle: string;
  price: string;
  capacity?: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  tourPrice: string;
  tourType?: string;
  pricing?: PricingTier[];
}

const inputClass = 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm text-gray-900 transition-colors';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

const defaultCapacity: Record<string, number> = {
  'Sedan/Hatchback': 3,
  'SUV': 6,
  'Van': 13,
};

const NATIONALITIES = [
  'Filipino',
  '──────────',
  'American', 'Australian', 'British', 'Canadian', 'Chinese', 'French', 'German',
  'Indian', 'Indonesian', 'Israeli', 'Italian', 'Japanese', 'Korean', 'Malaysian',
  'New Zealander', 'Russian', 'Singaporean', 'Spanish', 'Swiss', 'Taiwanese', 'Thai', 'Vietnamese',
  '──────────',
  'Afghan', 'Albanian', 'Algerian', 'Argentinian', 'Armenian', 'Austrian', 'Azerbaijani',
  'Bahraini', 'Bangladeshi', 'Belgian', 'Bolivian', 'Bosnian', 'Brazilian', 'Bulgarian',
  'Cambodian', 'Chilean', 'Colombian', 'Croatian', 'Czech', 'Danish', 'Dutch',
  'Egyptian', 'Emirati', 'Estonian', 'Ethiopian', 'Finnish', 'Georgian', 'Greek',
  'Guatemalan', 'Honduran', 'Hungarian', 'Iranian', 'Iraqi', 'Irish', 'Jordanian',
  'Kazakhstani', 'Kenyan', 'Kuwaiti', 'Laotian', 'Latvian', 'Lebanese', 'Lithuanian',
  'Macedonian', 'Mexican', 'Mongolian', 'Moroccan', 'Myanmarese', 'Nepalese', 'Nigerian',
  'Norwegian', 'Omani', 'Pakistani', 'Panamanian', 'Peruvian', 'Polish', 'Portuguese',
  'Qatari', 'Romanian', 'Saudi', 'Serbian', 'Slovak', 'Slovenian', 'South African',
  'Sri Lankan', 'Swedish', 'Tunisian', 'Turkish', 'Ukrainian', 'Uruguayan',
  'Uzbekistani', 'Venezuelan', 'Other',
];

const MAX_VAN_CAPACITY = 13;

export function BookingModal({ isOpen, onClose, tourName, tourPrice, tourType, pricing }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    nationality: '',
    tourDate: '',
    tourTime: '',
    tourPeriod: '',
    pax: '',
    pickupLocation: '',
    dropoffLocation: '',
    vehicleType: '',
    beachSelection: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<PolicyType>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    if (e.target.name === 'pax' && pricing) {
      const pax = parseInt(e.target.value);
      if (pax > 0 && pax <= MAX_VAN_CAPACITY) {
        const fit = pricing.find((p) => (p.capacity ?? defaultCapacity[p.vehicle] ?? 0) >= pax);
        if (fit) updated.vehicleType = fit.vehicle;
      } else if (pax > MAX_VAN_CAPACITY) {
        updated.vehicleType = 'Van';
      }
    }
    setFormData(updated);
  };

  // Derived pricing
  const selectedPrice = pricing && formData.vehicleType
    ? pricing.find((p) => p.vehicle === formData.vehicleType)?.price ?? tourPrice
    : tourPrice;

  const paxCount = parseInt(formData.pax) || 0;
  const basePrice = parseInt(selectedPrice) || 0;
  const tourExtras = tourType === 'Tour Package' ? getTourExtraFees(tourName, tourType) : null;
  const envFee = tourExtras?.environmental ?? 0;
  const entranceFee = tourExtras?.entrance ?? 0;

  // Multi-vehicle
  const isMultiVehicle = !!pricing && paxCount > MAX_VAN_CAPACITY;
  const vehiclesNeeded = isMultiVehicle ? Math.ceil(paxCount / MAX_VAN_CAPACITY) : 1;
  const vanPrice = pricing ? parseInt(pricing.find((p) => p.vehicle === 'Van')?.price ?? tourPrice) : 0;

  const subtotal = isMultiVehicle
    ? vehiclesNeeded * vanPrice
    : !pricing && (tourType === 'Tour Package' || tourType === 'Transfer')
      ? basePrice * paxCount
      : basePrice;
  const envTotal = envFee * paxCount;
  const entranceTotal = entranceFee * paxCount;
  const grandTotal = subtotal + envTotal + entranceTotal;
  const showTotal = !!formData.pax && !!selectedPrice;

  const getSelectedCapacity = () => {
    if (!formData.vehicleType) return null;
    const tier = pricing?.find((p) => p.vehicle === formData.vehicleType);
    return tier?.capacity ?? defaultCapacity[formData.vehicleType] ?? null;
  };
  const selectedCapacity = getSelectedCapacity();
  const overCapacity = !isMultiVehicle && selectedCapacity !== null && paxCount > selectedCapacity;

  const getVehicleTip = () => {
    if (isMultiVehicle || !paxCount) return null;
    if (paxCount <= 3) return `For ${paxCount} pax, Sedan/Hatchback is most affordable.`;
    if (paxCount <= 6) return `For ${paxCount} pax, we recommend an SUV or Van.`;
    return `For ${paxCount} pax, a Van is required.`;
  };
  const vehicleTip = pricing ? getVehicleTip() : null;

  // Step validation
  const step1Valid = formData.fullName.trim() !== '' && formData.nationality !== '' && formData.phone.length >= 8;
  const step2Valid = formData.tourDate !== '' && (formData.tourTime !== '' || formData.tourPeriod !== '');
  const step3Valid = formData.pax !== '' && (!pricing || isMultiVehicle || formData.vehicleType !== '');
  const step4Valid =
    formData.pickupLocation.trim() !== '' &&
    formData.dropoffLocation.trim() !== '' &&
    (!tourName.includes('PPC Beach') || formData.beachSelection !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!agreedToTerms) { setError('Please agree to the Terms & Conditions.'); return; }

    const lastSent = localStorage.getItem('lastBookingSent');
    if (lastSent && Date.now() - parseInt(lastSent) < 5 * 60 * 1000) {
      setError('Please wait 5 minutes before submitting another booking.');
      return;
    }

    setSending(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        tourType === 'Tour Package' ? EMAILJS_TEMPLATE_TOURS : EMAILJS_TEMPLATE_RIDES,
        {
          from_name: formData.fullName,
          phone: formData.phone,
          nationality: formData.nationality || 'N/A',
          tour_name: tourName,
          vehicle_type: isMultiVehicle ? `Van ×${vehiclesNeeded} (${paxCount} pax)` : formData.vehicleType || 'N/A',
          tour_price: isMultiVehicle ? (vehiclesNeeded * vanPrice).toString() : selectedPrice,
          tour_date: formData.tourDate,
          tour_time: formData.tourTime || formData.tourPeriod,
          pax: formData.pax,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          beach_selection: formData.beachSelection || 'N/A',
          message: isMultiVehicle
            ? `[FLEET BOOKING: ${vehiclesNeeded} vans for ${paxCount} pax] ${formData.message || 'No additional message.'}`
            : formData.message || 'No additional message.',
        },
        EMAILJS_PUBLIC_KEY
      );

      localStorage.setItem('lastBookingSent', Date.now().toString());

      const vehicleInfo = isMultiVehicle ? ` (${vehiclesNeeded}× Van)` : formData.vehicleType ? ` (${formData.vehicleType})` : '';
      const beachInfo = formData.beachSelection ? `\nBeach: ${formData.beachSelection}` : '';
      const waMessage = encodeURIComponent(
        `🏝️ New Booking!\nRoute: ${tourName}${vehicleInfo}\nPrice: ₱${grandTotal.toLocaleString()}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nNationality: ${formData.nationality || 'N/A'}\nDate: ${formData.tourDate} at ${formData.tourTime || formData.tourPeriod}\nPax: ${formData.pax}${isMultiVehicle ? ` (${vehiclesNeeded} vans needed)` : ''}${beachInfo}\nPickup: ${formData.pickupLocation}\nDrop-off: ${formData.dropoffLocation}\nNotes: ${formData.message || 'None'}`
      );
      fetch(`https://api.callmebot.com/whatsapp.php?phone=639217792016&text=${waMessage}&apikey=1091963`).catch(() => {});

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setStep(1);
        setFormData({ fullName: '', phone: '', nationality: '', tourDate: '', tourTime: '', tourPeriod: '', pax: '', pickupLocation: '', dropoffLocation: '', vehicleType: '', beachSelection: '', message: '' });
        setAgreedToTerms(false);
      }, 3000);
    } catch {
      setError('Failed to send booking. Please contact us directly.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const stepLabels = ['Contact', 'Schedule', 'Passengers', 'Trip Details', 'Review'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[96vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 rounded-t-2xl px-5 py-4 flex justify-between items-start">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 bg-[#e8a020] text-white">
              {tourType === 'Private Ride' ? 'Private Ride' : tourType === 'Transfer' ? 'Airport Transfer' : 'Tour Package'}
            </span>
            <h2 className="text-gray-900 font-black text-xl leading-tight">
              {tourType === 'Private Ride' ? 'Book This Ride' : tourType === 'Transfer' ? 'Book a Transfer' : 'Book This Tour'}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">{tourName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {!submitted ? (
            <>
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-6">
                {stepLabels.map((label, i) => {
                  const num = i + 1;
                  const isActive = step === num;
                  const isDone = step > num;
                  return (
                    <div key={num} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone ? 'bg-primary text-white' : isActive ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isDone ? <Check size={13} /> : num}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : isDone ? 'text-primary/60' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div className={`w-10 h-0.5 mb-4 mx-1 transition-all ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              {/* Step 1: Contact */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>{tourType === 'Tour Package' ? 'Lead Guest Name' : 'Full Name'} *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="ex. Juan Dela Cruz" />
                  </div>
                  <div>
                    <label className={labelClass}>Nationality *</label>
                    <select name="nationality" value={formData.nationality} onChange={handleChange} className={inputClass}>
                      <option value="">Select your nationality</option>
                      {NATIONALITIES.map((n, i) =>
                        n.startsWith('──') ? (
                          <option key={i} disabled>{n}</option>
                        ) : (
                          <option key={n} value={n}>{n}</option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <PhoneInput
                      country="ph"
                      value={formData.phone}
                      onChange={(val) => setFormData({ ...formData, phone: val })}
                      inputProps={{ name: 'phone', placeholder: 'ex. 09123456789' }}
                      containerStyle={{ width: '100%' }}
                      inputStyle={{
                        width: '100%',
                        paddingTop: '0.625rem',
                        paddingBottom: '0.625rem',
                        paddingLeft: '3.5rem',
                        paddingRight: '0.75rem',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        color: '#111827',
                        height: 'auto',
                        lineHeight: 'normal',
                      }}
                      buttonStyle={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRight: 'none',
                        borderRadius: '0.75rem 0 0 0.75rem',
                      }}
                      dropdownStyle={{ borderRadius: '0.75rem', marginTop: '4px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!step1Valid}
                    className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      <Calendar size={12} className="inline mr-1" />
                      {tourType === 'Private Ride' ? 'Travel Date' : tourType === 'Transfer' ? 'Pick-up Date' : 'Tour Date'} *
                    </label>
                    <input type="date" name="tourDate" value={formData.tourDate} onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]} className={inputClass} />
                  </div>

                  {(tourType === 'Private Ride' || tourType === 'Transfer') && (
                    <div>
                      <label className={labelClass}>
                        <Clock size={12} className="inline mr-1" />
                        {tourType === 'Transfer' ? 'Pick-up Time' : 'Preferred Time'} *
                      </label>
                      <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} className={inputClass} />
                    </div>
                  )}

                  {tourType === 'Tour Package' && (() => {
                    const isUnderground = tourName.includes('Underground River');
                    const isFirefly = tourName.includes('Firefly');
                    const periods = isUnderground ? ['AM (Morning)'] : isFirefly ? ['PM (Afternoon)'] : ['AM (Morning)', 'PM (Afternoon)'];
                    return (
                      <div>
                        <label className={labelClass}><Clock size={12} className="inline mr-1" />Time of Tour *</label>
                        <div className={`grid gap-2 ${periods.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {periods.map((period) => (
                            <button key={period} type="button"
                              onClick={() => setFormData({ ...formData, tourPeriod: period })}
                              className={`py-2.5 border-2 rounded-xl text-sm font-semibold transition-all ${
                                formData.tourPeriod === period
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-primary/40'
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                        {isUnderground && <p className="text-xs text-amber-600 mt-2 flex items-start gap-1"><span>⚠️</span><span>AM only (8:00 AM – 4:00 PM). PM tours are not available.</span></p>}
                        {isFirefly && <p className="text-xs text-amber-600 mt-2 flex items-start gap-1"><span>⚠️</span><span>Evening tour (PM only). Tours depart after sundown.</span></p>}
                      </div>
                    );
                  })()}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} disabled={!step2Valid}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Passengers & Vehicle */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}><Users size={12} className="inline mr-1" />Number of Passengers *</label>
                    <input type="number" name="pax" value={formData.pax} onChange={handleChange} min={1}
                      placeholder="ex. 3" className={inputClass} />
                    {isMultiVehicle && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        <p className="font-bold mb-0.5">⚠️ Fleet booking required</p>
                        <p>Your group of <strong>{paxCount}</strong> requires <strong>{vehiclesNeeded} vans</strong> (max 13 pax each). Estimated total: <strong>₱{(vehiclesNeeded * vanPrice).toLocaleString()}</strong>. We'll confirm the fleet arrangement via WhatsApp.</p>
                      </div>
                    )}
                  </div>

                  {pricing && pricing.length > 0 && !isMultiVehicle && (
                    <div>
                      <label className={labelClass}><Car size={12} className="inline mr-1" />Vehicle Type *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {pricing.map((p) => (
                          <button
                            key={p.vehicle}
                            type="button"
                            onClick={() => setFormData({ ...formData, vehicleType: p.vehicle })}
                            className={`p-2.5 border-2 rounded-xl text-center transition-all ${
                              formData.vehicleType === p.vehicle
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/40 bg-gray-50'
                            }`}
                          >
                            <div className="text-[10px] text-gray-500 mb-0.5">{p.vehicle}</div>
                            <div className="text-primary font-black text-sm">₱{parseInt(p.price).toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Max {p.capacity ?? defaultCapacity[p.vehicle]} pax</div>
                          </button>
                        ))}
                      </div>
                      {overCapacity && <p className="text-xs text-red-500 mt-2">⚠️ Exceeds {formData.vehicleType} capacity ({selectedCapacity} pax). Choose a larger vehicle.</p>}
                      {vehicleTip && !overCapacity && <p className="text-xs text-blue-600 mt-2">💡 {vehicleTip}</p>}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => setStep(4)} disabled={!step3Valid}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Trip Details */}
              {step === 4 && (
                <div className="space-y-4">
                  {tourName.includes('PPC Beach') && (
                    <div>
                      <label className={labelClass}>🏖️ Select Beach *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Tala Beach', 'Nagtabon Beach', 'Pakpak Lauin'].map((beach) => (
                          <button
                            key={beach}
                            type="button"
                            onClick={() => setFormData({ ...formData, beachSelection: beach })}
                            className={`py-2 px-1 border-2 rounded-xl text-xs font-semibold text-center transition-all ${
                              formData.beachSelection === beach
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-primary/40 text-gray-500 bg-gray-50'
                            }`}
                          >
                            {beach}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}><MapPin size={12} className="inline mr-1" />Pick-up *</label>
                      <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={inputClass} placeholder="ex. Sunlight Hotel" />
                    </div>
                    <div>
                      <label className={labelClass}><MapPin size={12} className="inline mr-1" />Drop-off *</label>
                      <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={inputClass} placeholder="ex. El Nido Town" />
                    </div>
                  </div>

                  {tourName.includes('El Nido') && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>Drop-off within El Nido town is included. Resorts outside town may incur <strong>₱500–₱1,500</strong> extra.</span>
                    </p>
                  )}

                  <div>
                    <label className={labelClass}><MessageSquare size={12} className="inline mr-1" />Special Requests (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
                      className={`${inputClass} resize-none`} placeholder="ex. Need child seat, early pick-up, extra stop..." />
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(3)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => setStep(5)} disabled={!step4Valid}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      Review <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Book */}
              {step === 5 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Booking Summary</p>
                    {([
                      { label: 'Name', value: formData.fullName },
                      { label: 'Nationality', value: formData.nationality },
                      { label: 'Phone', value: `+${formData.phone}` },
                      { label: tourType === 'Private Ride' ? 'Travel Date' : tourType === 'Transfer' ? 'Pick-up Date' : 'Tour Date', value: formData.tourDate },
                      { label: 'Time', value: formData.tourTime || formData.tourPeriod },
                      ...(isMultiVehicle ? [{ label: 'Fleet', value: `${vehiclesNeeded}× Van (${paxCount} pax)` }] : formData.vehicleType ? [{ label: 'Vehicle', value: formData.vehicleType }] : []),
                      { label: 'Passengers', value: formData.pax },
                      { label: 'Pick-up', value: formData.pickupLocation },
                      { label: 'Drop-off', value: formData.dropoffLocation },
                      ...(formData.beachSelection ? [{ label: 'Beach', value: formData.beachSelection }] : []),
                      ...(formData.message ? [{ label: 'Requests', value: formData.message }] : []),
                    ] as { label: string; value: string }[]).map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-gray-400 flex-shrink-0">{label}</span>
                        <span className="text-gray-800 font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  {showTotal && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5">
                      {isMultiVehicle && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₱{vanPrice.toLocaleString()} × {vehiclesNeeded} vans</span>
                          <span>₱{subtotal.toLocaleString()}</span>
                        </div>
                      )}
                      {!isMultiVehicle && !pricing && (tourType === 'Tour Package' || tourType === 'Transfer') && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₱{basePrice.toLocaleString()} × {paxCount} pax</span>
                          <span>₱{subtotal.toLocaleString()}</span>
                        </div>
                      )}
                      {envFee > 0 && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>🌿 Environmental fee × {paxCount} pax</span>
                          <span>₱{envTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {entranceFee > 0 && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>🎫 Entrance fee × {paxCount} pax</span>
                          <span>₱{entranceTotal.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                        <span className="text-sm font-semibold text-gray-700">
                          {isMultiVehicle ? 'Fleet Estimate' : (tourType === 'Tour Package' && !pricing) || tourType === 'Transfer' ? 'Estimated Total' : 'Total (flat rate)'}
                        </span>
                        <span className="text-xl font-black text-primary">₱{grandTotal.toLocaleString()}</span>
                      </div>
                      {tourType === 'Transfer' && (
                        <p className="text-[10px] text-amber-600">⚠️ Minimum ₱550. Final rate may vary by drop-off location.</p>
                      )}
                    </div>
                  )}

                  {/* T&C */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" id="agreeTerms" checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0 cursor-pointer" />
                    <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <button type="button" onClick={() => setOpenPolicy('booking')} className="text-primary underline font-medium">Booking Policy</button>,{' '}
                      <button type="button" onClick={() => setOpenPolicy('cancellation')} className="text-primary underline font-medium">Cancellation Policy</button>, and{' '}
                      <button type="button" onClick={() => setOpenPolicy('terms')} className="text-primary underline font-medium">Terms & Conditions</button>.
                    </label>
                  </div>

                  {error && <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2">{error}</p>}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(4)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="submit" disabled={sending || !agreedToTerms}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {sending ? 'Sending...' : <><Check size={15} />Submit Booking</>}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">We'll contact you via WhatsApp, phone or email to confirm.</p>
                </form>
              )}
            </>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <Check size={28} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">Request Sent!</h3>
              <p className="text-gray-400 text-sm mb-6">Your booking request for <span className="font-semibold text-gray-600">{tourName}</span> has been received.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-left space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.518 5.829L.057 23.5l5.83-1.527A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.368l-.359-.213-3.72.975.993-3.635-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">We'll reach out via WhatsApp</p>
                    <p className="text-xs text-gray-400 mt-0.5">Expect a confirmation message shortly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">Downpayment required to confirm</p>
                    <p className="text-xs text-gray-400 mt-0.5">Your booking is held once downpayment is settled.</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
      <PolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </div>
  );
}
