import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { PolicyModal, type PolicyType } from '../components/PolicyModal';
import { PromoPrice } from '../components/PromoPrice';
import { BookingStepIndicator, stepLabels } from '../components/booking/BookingStepIndicator';
import { BookingSummaryPanel } from '../components/booking/BookingSummaryPanel';
import { BookingMobileNav } from '../components/booking/BookingMobileNav';
import { useCurrency } from '../context/CurrencyContext';
import { getTourExtraFees, hasPromoRate } from '../utils/pricing';
import { buildServiceWhatsAppUrl, getServiceListPath } from '../utils/serviceHelpers';
import {
  clearBookingDraft,
  emptyBookingFormData,
  loadBookingDraft,
  saveBookingDraft,
} from '../utils/bookingDraft';
import {
  getStep1Errors,
  getStep2Errors,
  getStep3Errors,
  getStep4Errors,
} from '../utils/bookingValidation';
import { slugify } from './ServicePage';
import { Calendar, Clock, MapPin, Users, MessageSquare, Car, Check, ChevronRight, ChevronLeft, ArrowLeft, ExternalLink } from 'lucide-react';

const EMAILJS_SERVICE_ID = 'service_w5vk124';
const EMAILJS_TEMPLATE_RIDES = 'template_pnxzs9s';
const EMAILJS_TEMPLATE_TOURS = 'template_vxsclk9';
const EMAILJS_PUBLIC_KEY = 'RaznTonJuUEVxkdZp';

interface PricingTier {
  vehicle: string;
  price: string;
  capacity?: number;
}

const inputClass = 'w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm text-gray-900 transition-colors';
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

function getPickupPlaceholder(tourName: string): string {
  if (tourName.includes('El Nido')) return 'e.g. Spin Designer Hostel, El Nido town';
  if (tourName.includes('Port Barton')) return 'e.g. your hotel in Port Barton';
  if (tourName.includes('Sabang') || tourName.includes('Underground')) return 'e.g. hotel in Sabang or Puerto Princesa';
  if (tourName.includes('San Vicente')) return 'e.g. Long Beach resort, San Vicente';
  return 'e.g. Sunlight Hotel, Puerto Princesa';
}

function getDropoffPlaceholder(tourName: string): string {
  if (tourName.includes('El Nido')) return 'e.g. El Nido town or resort name';
  if (tourName.includes('Puerto Princesa') && tourName.includes('Airport')) return 'e.g. Puerto Princesa International Airport';
  return 'e.g. El Nido Town, hotel name';
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { tourName: string; tourPrice: string; tourType: string; pricing?: PricingTier[] } | null;

  useEffect(() => {
    if (!state?.tourName) {
      navigate('/', { replace: true });
      return;
    }
    window.scrollTo(0, 0);
    document.title = `Book ${state.tourName} | Palawan Private Rides`;
  }, [state?.tourName, navigate]);

  if (!state?.tourName) return null;

  const { tourName, tourPrice, tourType, pricing } = state;
  const listPath = getServiceListPath(tourType);

  return (
    <BookingForm
      tourName={tourName}
      tourPrice={tourPrice}
      tourType={tourType}
      pricing={pricing}
      listHref={listPath.href}
      listLabel={listPath.label}
      onBack={() => navigate(listPath.href)}
    />
  );
}

function BookingForm({ tourName, tourPrice, tourType, pricing, listHref, listLabel, onBack }: {
  tourName: string;
  tourPrice: string;
  tourType: string;
  pricing?: PricingTier[];
  listHref: string;
  listLabel: string;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();
  const [step, setStep] = useState(() => {
    const draft = loadBookingDraft(tourName);
    const s = draft?.step ?? 1;
    return s >= 1 && s <= 5 ? s : 1;
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<PolicyType>(null);
  const [stepAttempted, setStepAttempted] = useState<number | null>(null);

  const [formData, setFormData] = useState(() => {
    const draft = loadBookingDraft(tourName);
    return draft?.formData ?? emptyBookingFormData();
  });

  useEffect(() => {
    if (!submitted) {
      saveBookingDraft({ tourName, tourType, step, formData });
    }
  }, [tourName, tourType, step, formData, submitted]);

  const whatsappHref = buildServiceWhatsAppUrl(tourName);
  const servicePath = `/services/${slugify(tourName)}`;
  const progressPct = ((step - 1) / (stepLabels.length - 1)) * 100;

  const tryAdvance = (nextStep: number, valid: boolean, currentStep: number) => {
    if (!valid) {
      setStepAttempted(currentStep);
      return;
    }
    setStepAttempted(null);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const selectedPrice = pricing && formData.vehicleType
    ? pricing.find((p) => p.vehicle === formData.vehicleType)?.price ?? tourPrice
    : tourPrice;

  const paxCount = parseInt(formData.pax) || 0;
  const basePrice = parseInt(selectedPrice) || 0;
  const tourExtras = tourType === 'Tour Package' ? getTourExtraFees(tourName, tourType) : null;
  const envFee = tourExtras?.environmental ?? 0;
  const entranceFee = tourExtras?.entrance ?? 0;

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

  const step1Valid = Object.keys(getStep1Errors(formData)).length === 0;
  const step2Valid = Object.keys(getStep2Errors(formData)).length === 0;
  const step3Valid =
    Object.keys(getStep3Errors(formData, { needsVehicle: !!pricing, isMultiVehicle })).length === 0 &&
    !overCapacity;
  const step4Valid = Object.keys(getStep4Errors(formData, tourName)).length === 0;

  const step1Errors = stepAttempted === 1 ? getStep1Errors(formData) : {};
  const step2Errors = stepAttempted === 2 ? getStep2Errors(formData) : {};
  const step3Errors = stepAttempted === 3 ? getStep3Errors(formData, { needsVehicle: !!pricing, isMultiVehicle }) : {};
  const step4Errors = stepAttempted === 4 ? getStep4Errors(formData, tourName) : {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const submitBooking = async () => {
    setShowConfirm(false);
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
          email: formData.email,
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
      const rawMessage = `🏝️ New Booking!\nRoute: ${tourName}${vehicleInfo}\nPrice: ₱${grandTotal.toLocaleString()}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nNationality: ${formData.nationality || 'N/A'}\nDate: ${formData.tourDate} at ${formData.tourTime || formData.tourPeriod}\nPax: ${formData.pax}${isMultiVehicle ? ` (${vehiclesNeeded} vans needed)` : ''}${beachInfo}\nPickup: ${formData.pickupLocation}\nDrop-off: ${formData.dropoffLocation}\nNotes: ${formData.message || 'None'}`;
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawMessage }),
      }).catch(() => {});

      clearBookingDraft();
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch {
      setError('Failed to send booking. Please contact us directly.');
    } finally {
      setSending(false);
    }
  };

  const typeLabel = tourType === 'Private Ride' ? 'Private Ride' : tourType === 'Transfer' ? 'Airport Transfer' : 'Tour Package';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top bar */}
      <div className="pt-20 pb-0 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} aria-label={`Back to ${listLabel}`} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1 bg-[#e8a020] text-white">
              {typeLabel}
            </span>
            <p className="font-black text-gray-900 text-base leading-tight truncate">{tourName}</p>
          </div>
          <Link
            to={servicePath}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline flex-shrink-0"
          >
            View details <ExternalLink size={12} />
          </Link>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className={`max-w-6xl mx-auto px-4 py-8 ${!submitted && step < 5 ? 'pb-28 lg:pb-8' : ''}`}>
        {!submitted ? (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
            <div className="lg:col-span-2">
            <BookingStepIndicator step={step} />

            <div>
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              {/* Step 1: Contact */}
              {step === 1 && (
                <div className="space-y-7">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">Your Contact Info</h3>
                    <p className="text-xs text-gray-400">We'll use this to confirm your booking. Fast reply on WhatsApp after you submit.</p>
                  </div>
                  <div className="rounded-xl border border-[#e8a020]/30 bg-[#e8a020]/5 px-4 py-3 text-xs text-gray-700">
                    <span className="font-bold text-[#1a3728]">Trusted by 300+ travelers</span>
                    {' · '}
                    Request only — no payment on this form.
                  </div>
                  <div>
                    <label className={labelClass}>{tourType === 'Tour Package' ? 'Lead Guest Name' : 'Full Name'} *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="ex. Juan Dela Cruz" />
                    <FieldError message={step1Errors.fullName} />
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
                    <FieldError message={step1Errors.nationality} />
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
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
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
                    <FieldError message={step1Errors.phone} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="ex. juan@email.com" />
                    <FieldError message={step1Errors.email} />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Prefer WhatsApp?{' '}
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold hover:underline">
                      Chat with us directly
                    </a>
                  </p>
                  <div className="hidden lg:flex">
                    <button
                      type="button"
                      onClick={() => tryAdvance(2, step1Valid, 1)}
                      className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Next — Schedule <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div className="space-y-7">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">When are you going?</h3>
                    <p className="text-xs text-gray-400">Pick your preferred date and time.</p>
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Calendar size={12} className="inline mr-1" />
                      {tourType === 'Private Ride' ? 'Travel Date' : tourType === 'Transfer' ? 'Pick-up Date' : 'Tour Date'} *
                    </label>
                    <input type="date" name="tourDate" value={formData.tourDate} onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]} className={inputClass} />
                    <FieldError message={step2Errors.tourDate} />
                  </div>

                  {(tourType === 'Private Ride' || tourType === 'Transfer') && (
                    <div>
                      <label className={labelClass}>
                        <Clock size={12} className="inline mr-1" />
                        {tourType === 'Transfer' ? 'Pick-up Time' : 'Preferred Time'} *
                      </label>
                      <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} className={inputClass} />
                      <FieldError message={step2Errors.tourTime} />
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
                              className={`py-3 border-2 rounded-xl text-sm font-semibold transition-all ${
                                formData.tourPeriod === period
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40'
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                        {isUnderground && <p className="text-xs text-amber-600 mt-2 flex items-start gap-1"><span>⚠️</span><span>AM only (8:00 AM – 4:00 PM). PM tours are not available.</span></p>}
                        {isFirefly && <p className="text-xs text-amber-600 mt-2 flex items-start gap-1"><span>⚠️</span><span>Evening tour (PM only). Tours depart after sundown.</span></p>}
                        <FieldError message={step2Errors.tourTime} />
                      </div>
                    );
                  })()}

                  <div className="hidden lg:flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => tryAdvance(3, step2Valid, 2)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Passengers & Vehicle */}
              {step === 3 && (
                <div className="space-y-7">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">Passengers & Vehicle</h3>
                    <p className="text-xs text-gray-400">How many are coming? We'll suggest the right vehicle.</p>
                  </div>
                  <div>
                    <label className={labelClass}><Users size={12} className="inline mr-1" />Number of Passengers *</label>
                    <input type="number" name="pax" value={formData.pax} onChange={handleChange} min={1}
                      placeholder="ex. 3" className={inputClass} />
                    <FieldError message={step3Errors.pax} />
                    {isMultiVehicle && (
                      <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                        <p className="font-bold mb-1">⚠️ Fleet booking required</p>
                        <p>Your group of <strong>{paxCount}</strong> requires <strong>{vehiclesNeeded} vans</strong> (max 13 pax each). Estimated total: <strong>{convertPrice(vehiclesNeeded * vanPrice)}</strong>. We'll confirm the fleet arrangement via WhatsApp.</p>
                      </div>
                    )}
                  </div>

                  {pricing && pricing.length > 0 && !isMultiVehicle && (
                    <div>
                      <label className={labelClass}><Car size={12} className="inline mr-1" />Vehicle Type *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {pricing.map((p) => (
                          <button
                            key={p.vehicle}
                            type="button"
                            onClick={() => setFormData({ ...formData, vehicleType: p.vehicle })}
                            className={`p-3 border-2 rounded-xl text-center transition-all ${
                              formData.vehicleType === p.vehicle
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/40 bg-white'
                            }`}
                          >
                            <div className="text-[11px] text-gray-500 mb-1">{p.vehicle}</div>
                            <div className="text-primary font-black text-base">{convertPrice(parseInt(p.price))}</div>
                            <div className="text-[11px] text-gray-400 mt-1">Max {p.capacity ?? defaultCapacity[p.vehicle]} pax</div>
                          </button>
                        ))}
                      </div>
                      {overCapacity && <p className="text-xs text-red-500 mt-2">⚠️ Exceeds {formData.vehicleType} capacity ({selectedCapacity} pax). Choose a larger vehicle.</p>}
                      <FieldError message={step3Errors.vehicleType} />
                      {vehicleTip && !overCapacity && <p className="text-xs text-blue-600 mt-2">💡 {vehicleTip}</p>}
                    </div>
                  )}

                  <div className="hidden lg:flex gap-3">
                    <button type="button" onClick={() => setStep(2)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => tryAdvance(4, step3Valid, 3)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Trip Details */}
              {step === 4 && (
                <div className="space-y-7">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">Trip Details</h3>
                    <p className="text-xs text-gray-400">Where should we pick you up and drop you off?</p>
                  </div>

                  {tourName.includes('PPC Beach') && (
                    <div>
                      <label className={labelClass}>🏖️ Select Beach *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Tala Beach', 'Nagtabon Beach', 'Pakpak Lauin'].map((beach) => (
                          <button
                            key={beach}
                            type="button"
                            onClick={() => setFormData({ ...formData, beachSelection: beach })}
                            className={`py-2.5 px-1 border-2 rounded-xl text-xs font-semibold text-center transition-all ${
                              formData.beachSelection === beach
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-primary/40 text-gray-500 bg-white'
                            }`}
                          >
                            {beach}
                          </button>
                        ))}
                      </div>
                      <FieldError message={step4Errors.beachSelection} />
                    </div>
                  )}

                  <div>
                    <label className={labelClass}><MapPin size={12} className="inline mr-1" />Pick-up Location *</label>
                    <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={inputClass} placeholder={getPickupPlaceholder(tourName)} />
                    <FieldError message={step4Errors.pickupLocation} />
                  </div>
                  <div>
                    <label className={labelClass}><MapPin size={12} className="inline mr-1" />Drop-off Location *</label>
                    <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={inputClass} placeholder={getDropoffPlaceholder(tourName)} />
                    <FieldError message={step4Errors.dropoffLocation} />
                  </div>

                  {tourName.includes('El Nido') && !tourName.includes('El Nido Island Tour') && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>Drop-off within El Nido town is included. Resorts outside town may incur <strong>₱500–₱1,500</strong> extra.</span>
                    </p>
                  )}
                  {tourExtras && (tourExtras.environmental > 0 || tourExtras.entrance > 0) && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <span className="flex-shrink-0">ℹ️</span>
                      <span>
                        Estimated total includes tour rate
                        {tourExtras.environmental > 0 ? `, ₱${tourExtras.environmental} environmental fee` : ''}
                        {tourExtras.entrance > 0 ? `, and ₱${tourExtras.entrance} entrance fee` : ''} per person.
                      </span>
                    </p>
                  )}

                  <div>
                    <label className={labelClass}><MessageSquare size={12} className="inline mr-1" />Special Requests (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={3}
                      className={`${inputClass} resize-none`} placeholder="ex. Need child seat, early pick-up, extra stop..." />
                  </div>

                  <div className="hidden lg:flex gap-3">
                    <button type="button" onClick={() => setStep(3)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={() => tryAdvance(5, step4Valid, 4)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      Review <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Book */}
              {step === 5 && (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">Review your booking</h3>
                    <p className="text-xs text-gray-400">Double-check the details before submitting.</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5 text-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Booking Summary</p>
                    {([
                      { label: 'Name', value: formData.fullName },
                      { label: 'Nationality', value: formData.nationality },
                      { label: 'Phone', value: `+${formData.phone}` },
                      { label: 'Email', value: formData.email },
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
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 space-y-2">
                      {isMultiVehicle && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{convertPrice(vanPrice)} × {vehiclesNeeded} vans</span>
                          <span>{convertPrice(subtotal)}</span>
                        </div>
                      )}
                      {!isMultiVehicle && !pricing && (tourType === 'Tour Package' || tourType === 'Transfer') && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{convertPrice(basePrice)} × {paxCount} pax</span>
                          <span>{convertPrice(subtotal)}</span>
                        </div>
                      )}
                      {envFee > 0 && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>🌿 Environmental fee × {paxCount} pax</span>
                          <span>{convertPrice(envTotal)}</span>
                        </div>
                      )}
                      {entranceFee > 0 && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>🎫 Entrance fee × {paxCount} pax</span>
                          <span>{convertPrice(entranceTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
                        <span className="font-semibold text-gray-700">
                          {isMultiVehicle ? 'Fleet Estimate' : (tourType === 'Tour Package' && !pricing) || tourType === 'Transfer' ? 'Estimated Total' : 'Total (flat rate)'}
                        </span>
                        {hasPromoRate(tourType) && !isMultiVehicle ? (
                          <PromoPrice amount={grandTotal} type={tourType} size="md" showSavings showPromoLabel={false} />
                        ) : (
                          <span className="text-2xl font-black text-primary">{convertPrice(grandTotal)}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">Final payment is in Philippine Peso (PHP).</p>
                      {tourType === 'Transfer' && (
                        <p className="text-[11px] text-amber-600">⚠️ Minimum ₱550. Final rate may vary by drop-off location.</p>
                      )}
                    </div>
                  )}

                  {/* T&C */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
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

                  {error && <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-3">{error}</p>}

                  {showConfirm ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
                      <p className="text-sm font-bold text-gray-800 text-center">Submit this booking?</p>
                      <p className="text-xs text-gray-500 text-center">We'll send your request and follow up via WhatsApp, phone or email.</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setShowConfirm(false)}
                          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white transition-colors">
                          Cancel
                        </button>
                        <button type="button" onClick={submitBooking} disabled={sending}
                          className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                          {sending ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg> Sending...</> : <><Check size={14} /> Yes, Submit</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(4)}
                        className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button type="submit" disabled={sending || !agreedToTerms}
                        className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {sending ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg> Sending...</> : <><Check size={15} /> Submit Booking</>}
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400 text-center">Fast reply on WhatsApp, phone, or email to confirm.</p>
                </form>
              )}
            </div>
            </div>

            <div className="hidden lg:block lg:col-span-1 mt-8 lg:mt-0">
              <BookingSummaryPanel
                tourName={tourName}
                tourType={tourType}
                typeLabel={typeLabel}
                showTotal={showTotal}
                grandTotal={grandTotal}
                convertPrice={convertPrice}
                isMultiVehicle={isMultiVehicle}
                vehiclesNeeded={vehiclesNeeded}
                vanPrice={vanPrice}
                paxCount={paxCount}
                basePrice={basePrice}
                pricing={pricing}
                formData={formData}
                envFee={envFee}
                entranceFee={entranceFee}
                envTotal={envTotal}
                entranceTotal={entranceTotal}
                subtotal={subtotal}
              />
            </div>

            <BookingMobileNav
              show={step >= 1 && step <= 4}
              showBack={step > 1}
              onBack={() => setStep(step - 1)}
              onNext={() => {
                if (step === 1) tryAdvance(2, step1Valid, 1);
                else if (step === 2) tryAdvance(3, step2Valid, 2);
                else if (step === 3) tryAdvance(4, step3Valid, 3);
                else if (step === 4) tryAdvance(5, step4Valid, 4);
              }}
              nextLabel={step === 4 ? 'Review' : 'Next'}
            />

            <div className="lg:hidden mt-6">
              <BookingSummaryPanel
                tourName={tourName}
                tourType={tourType}
                typeLabel={typeLabel}
                showTotal={showTotal}
                grandTotal={grandTotal}
                convertPrice={convertPrice}
                isMultiVehicle={isMultiVehicle}
                vehiclesNeeded={vehiclesNeeded}
                vanPrice={vanPrice}
                paxCount={paxCount}
                basePrice={basePrice}
                pricing={pricing}
                formData={formData}
                envFee={envFee}
                entranceFee={entranceFee}
                envTotal={envTotal}
                entranceTotal={entranceTotal}
                subtotal={subtotal}
              />
            </div>
          </div>
        ) : (
          /* Success */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <Check size={28} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Request Sent!</h3>
            <p className="text-gray-400 text-sm mb-4">Your booking request for <span className="font-semibold text-gray-600">{tourName}</span> has been received.</p>
            <p className="text-xs text-gray-500 mb-6">Expect a fast reply on WhatsApp — we usually respond within a few hours.</p>
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
            <div className="flex flex-col gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity text-center"
              >
                Message us on WhatsApp
              </a>
              <button onClick={() => navigate('/')} className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
      <PolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </div>
  );
}
