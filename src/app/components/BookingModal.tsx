import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { X, Calendar, Clock, MapPin, Users, MessageSquare, Car, Check } from 'lucide-react';
import { PolicyModal, type PolicyType } from './PolicyModal';

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

export function BookingModal({ isOpen, onClose, tourName, tourPrice, tourType, pricing }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
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

  const selectedPrice = pricing && formData.vehicleType
    ? pricing.find((p) => p.vehicle === formData.vehicleType)?.price ?? tourPrice
    : tourPrice;

  const defaultCapacity: Record<string, number> = {
    'Sedan/Hatchback': 3,
    'SUV': 6,
    'Van': 13,
  };

  const getSelectedCapacity = () => {
    if (!formData.vehicleType) return null;
    const tier = pricing?.find((p) => p.vehicle === formData.vehicleType);
    return tier?.capacity ?? defaultCapacity[formData.vehicleType] ?? null;
  };

  const getVehicleTip = () => {
    const pax = parseInt(formData.pax);
    if (!pax) return null;
    if (pax <= 3) return `For ${pax} pax, Sedan/Hatchback is most affordable.`;
    if (pax <= 6) return `For ${pax} pax, we recommend an SUV or Van.`;
    return `For ${pax} pax, a Van is required.`;
  };

  const selectedCapacity = getSelectedCapacity();
  const overCapacity = selectedCapacity && formData.pax && parseInt(formData.pax) > selectedCapacity;
  const vehicleTip = pricing ? getVehicleTip() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (pricing && !formData.vehicleType) { setError('Please select a vehicle type.'); return; }

    if (pricing && formData.vehicleType && formData.pax) {
      const cap = defaultCapacity[formData.vehicleType];
      if (cap && parseInt(formData.pax) > cap) {
        setError(`Your group of ${formData.pax} exceeds ${formData.vehicleType} capacity (${cap} pax).`);
        return;
      }
    }

    const lastSent = localStorage.getItem('lastBookingSent');
    if (lastSent && Date.now() - parseInt(lastSent) < 5 * 60 * 1000) {
      setError('Please wait 5 minutes before submitting another booking.');
      return;
    }

    if (!agreedToTerms) { setError('Please agree to the Terms & Conditions.'); return; }

    setSending(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        tourType === 'Tour Package' ? EMAILJS_TEMPLATE_TOURS : EMAILJS_TEMPLATE_RIDES,
        {
          from_name: formData.fullName,
          phone: formData.phone,
          tour_name: tourName,
          vehicle_type: formData.vehicleType || 'N/A',
          tour_price: selectedPrice,
          tour_date: formData.tourDate,
          tour_time: formData.tourTime || formData.tourPeriod,
          pax: formData.pax,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          beach_selection: formData.beachSelection || 'N/A',
          message: formData.message || 'No additional message.',
        },
        EMAILJS_PUBLIC_KEY
      );

      localStorage.setItem('lastBookingSent', Date.now().toString());

      const vehicleInfo = formData.vehicleType ? ` (${formData.vehicleType})` : '';
      const beachInfo = formData.beachSelection ? `\nBeach: ${formData.beachSelection}` : '';
      const waMessage = encodeURIComponent(
        `🏝️ New Booking!\nRoute: ${tourName}${vehicleInfo}\nPrice: ₱${parseInt(selectedPrice).toLocaleString()}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nDate: ${formData.tourDate} at ${formData.tourTime || formData.tourPeriod}\nPax: ${formData.pax}${beachInfo}\nPickup: ${formData.pickupLocation}\nDrop-off: ${formData.dropoffLocation}\nNotes: ${formData.message || 'None'}`
      );
      fetch(`https://api.callmebot.com/whatsapp.php?phone=639217792016&text=${waMessage}&apikey=1091963`).catch(() => {});

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ fullName: '', phone: '', tourDate: '', tourTime: '', tourPeriod: '', pax: '', pickupLocation: '', dropoffLocation: '', vehicleType: '', beachSelection: '', message: '' });
        setAgreedToTerms(false);
      }, 3000);
    } catch {
      setError('Failed to send booking. Please contact us directly.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    if (e.target.name === 'pax' && pricing) {
      const pax = parseInt(e.target.value);
      if (pax > 0) {
        const fit = pricing.find((p) => (p.capacity ?? defaultCapacity[p.vehicle] ?? 0) >= pax);
        if (fit) updated.vehicleType = fit.vehicle;
      }
    }
    setFormData(updated);
  };

  const paxCount = parseInt(formData.pax) || 0;
  const basePrice = parseInt(selectedPrice) || 0;
  const hasEnvFee = tourType === 'Tour Package' && !tourName.includes('City Tour') && !tourName.includes('PPC Beach');
  const envFee = hasEnvFee ? 150 : 0;
  const subtotal = (!pricing && (tourType === 'Tour Package' || tourType === 'Transfer')) ? basePrice * paxCount : basePrice;
  const envTotal = envFee * paxCount;
  const grandTotal = subtotal + envTotal;
  const showTotal = !!formData.pax && !!selectedPrice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[96vh] sm:max-h-[90vh] overflow-y-auto">

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              {/* Vehicle Type */}
              {pricing && pricing.length > 0 && (
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

              {/* Beach Selection */}
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

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{tourType === 'Tour Package' ? 'Lead Guest Name' : 'Full Name'} *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="Juan Dela Cruz" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="+63 912 345 6789" />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className={labelClass}>
                  <Calendar size={12} className="inline mr-1" />
                  {tourType === 'Private Ride' ? 'Travel Date' : tourType === 'Transfer' ? 'Pick-up Date' : 'Tour Date'} *
                </label>
                <input type="date" name="tourDate" value={formData.tourDate} onChange={handleChange} required
                  min={new Date().toISOString().split('T')[0]} className={inputClass} />
              </div>

              {/* Time */}
              {tourType === 'Private Ride' && (
                <div>
                  <label className={labelClass}><Clock size={12} className="inline mr-1" />Preferred Time *</label>
                  <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} required className={inputClass} />
                </div>
              )}
              {tourType === 'Transfer' && (
                <div>
                  <label className={labelClass}><Clock size={12} className="inline mr-1" />Pick-up Time *</label>
                  <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} required className={inputClass} />
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

              {/* Pax */}
              <div>
                <label className={labelClass}><Users size={12} className="inline mr-1" />Number of Passengers *</label>
                <input type="number" name="pax" value={formData.pax} onChange={handleChange} required min={1}
                  max={selectedCapacity ?? undefined} placeholder="e.g. 3" className={inputClass} />
              </div>

              {/* Pickup / Dropoff */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><MapPin size={12} className="inline mr-1" />Pick-up *</label>
                  <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required className={inputClass} placeholder="Hotel or address" />
                </div>
                <div>
                  <label className={labelClass}><MapPin size={12} className="inline mr-1" />Drop-off *</label>
                  <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required className={inputClass} placeholder="Destination" />
                </div>
              </div>

              {/* El Nido note */}
              {tourName.includes('El Nido') && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>Drop-off within El Nido town is included. Resorts outside town may incur <strong>₱500–₱1,500</strong> extra.</span>
                </p>
              )}

              {/* Notes */}
              <div>
                <label className={labelClass}><MessageSquare size={12} className="inline mr-1" />Special Requests (Optional)</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
                  className={`${inputClass} resize-none`} placeholder="Any special requests or notes..." />
              </div>

              {/* Total */}
              {showTotal && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5">
                  {!pricing && (tourType === 'Tour Package' || tourType === 'Transfer') && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>₱{basePrice.toLocaleString()} × {paxCount} pax</span>
                      <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                  )}
                  {hasEnvFee && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Environmental fee × {paxCount} pax</span>
                      <span>₱{envTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {(tourType === 'Tour Package' && !pricing) || tourType === 'Transfer' ? 'Estimated Total' : 'Total (flat rate)'}
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
                <button type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={sending || !agreedToTerms}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {sending ? 'Sending...' : <><Check size={15} />Submit Booking</>}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">We'll contact you via WhatsApp or phone to confirm.</p>
            </form>
          ) : (
            <div className="py-14 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Booking Request Sent!</h3>
              <p className="text-gray-500 text-sm">We'll contact you via WhatsApp or phone to confirm.</p>
            </div>
          )}
        </div>
      </div>
      <PolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </div>
  );
}
