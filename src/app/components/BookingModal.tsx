import { useState } from 'react';
import emailjs from '@emailjs/browser';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
          nationality: formData.nationality || 'N/A',
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
        `🏝️ New Booking!\nRoute: ${tourName}${vehicleInfo}\nPrice: ₱${parseInt(selectedPrice).toLocaleString()}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nNationality: ${formData.nationality || 'N/A'}\nDate: ${formData.tourDate} at ${formData.tourTime || formData.tourPeriod}\nPax: ${formData.pax}${beachInfo}\nPickup: ${formData.pickupLocation}\nDrop-off: ${formData.dropoffLocation}\nNotes: ${formData.message || 'None'}`
      );
      fetch(`https://api.callmebot.com/whatsapp.php?phone=639217792016&text=${waMessage}&apikey=1091963`).catch(() => {});

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ fullName: '', phone: '', nationality: '', tourDate: '', tourTime: '', tourPeriod: '', pax: '', pickupLocation: '', dropoffLocation: '', vehicleType: '', beachSelection: '', message: '' });
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
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="ex. Juan Dela Cruz" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <PhoneInput
                    country="ph"
                    value={formData.phone}
                    onChange={(val) => setFormData({ ...formData, phone: val })}
                    inputProps={{ name: 'phone', required: true, placeholder: 'ex. 09123456789' }}
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
              </div>

              {/* Nationality */}
              <div>
                <label className={labelClass}>Nationality *</label>
                <select name="nationality" value={formData.nationality} onChange={handleChange} required className={inputClass}>
                  <option value="">Select your nationality</option>
                  <option value="Filipino">Filipino</option>
                  <option disabled>──────────</option>
                  <option value="American">American</option>
                  <option value="Australian">Australian</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Indian">Indian</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Israeli">Israeli</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Malaysian">Malaysian</option>
                  <option value="New Zealander">New Zealander</option>
                  <option value="Russian">Russian</option>
                  <option value="Singaporean">Singaporean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Swiss">Swiss</option>
                  <option value="Taiwanese">Taiwanese</option>
                  <option value="Thai">Thai</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option disabled>──────────</option>
                  <option value="Afghan">Afghan</option>
                  <option value="Albanian">Albanian</option>
                  <option value="Algerian">Algerian</option>
                  <option value="Argentinian">Argentinian</option>
                  <option value="Armenian">Armenian</option>
                  <option value="Austrian">Austrian</option>
                  <option value="Azerbaijani">Azerbaijani</option>
                  <option value="Bahraini">Bahraini</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Belgian">Belgian</option>
                  <option value="Bolivian">Bolivian</option>
                  <option value="Bosnian">Bosnian</option>
                  <option value="Brazilian">Brazilian</option>
                  <option value="Bulgarian">Bulgarian</option>
                  <option value="Cambodian">Cambodian</option>
                  <option value="Chilean">Chilean</option>
                  <option value="Colombian">Colombian</option>
                  <option value="Croatian">Croatian</option>
                  <option value="Czech">Czech</option>
                  <option value="Danish">Danish</option>
                  <option value="Dutch">Dutch</option>
                  <option value="Egyptian">Egyptian</option>
                  <option value="Emirati">Emirati</option>
                  <option value="Estonian">Estonian</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Finnish">Finnish</option>
                  <option value="Georgian">Georgian</option>
                  <option value="Greek">Greek</option>
                  <option value="Guatemalan">Guatemalan</option>
                  <option value="Honduran">Honduran</option>
                  <option value="Hungarian">Hungarian</option>
                  <option value="Iranian">Iranian</option>
                  <option value="Iraqi">Iraqi</option>
                  <option value="Irish">Irish</option>
                  <option value="Jordanian">Jordanian</option>
                  <option value="Kazakhstani">Kazakhstani</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Kuwaiti">Kuwaiti</option>
                  <option value="Laotian">Laotian</option>
                  <option value="Latvian">Latvian</option>
                  <option value="Lebanese">Lebanese</option>
                  <option value="Lithuanian">Lithuanian</option>
                  <option value="Macedonian">Macedonian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Mongolian">Mongolian</option>
                  <option value="Moroccan">Moroccan</option>
                  <option value="Myanmarese">Myanmarese</option>
                  <option value="Nepalese">Nepalese</option>
                  <option value="Nigerian">Nigerian</option>
                  <option value="Norwegian">Norwegian</option>
                  <option value="Omani">Omani</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Panamanian">Panamanian</option>
                  <option value="Peruvian">Peruvian</option>
                  <option value="Polish">Polish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Qatari">Qatari</option>
                  <option value="Romanian">Romanian</option>
                  <option value="Saudi">Saudi</option>
                  <option value="Serbian">Serbian</option>
                  <option value="Slovak">Slovak</option>
                  <option value="Slovenian">Slovenian</option>
                  <option value="South African">South African</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Swedish">Swedish</option>
                  <option value="Tunisian">Tunisian</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Ukrainian">Ukrainian</option>
                  <option value="Uruguayan">Uruguayan</option>
                  <option value="Uzbekistani">Uzbekistani</option>
                  <option value="Venezuelan">Venezuelan</option>
                  <option value="Other">Other</option>
                </select>
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
                  max={selectedCapacity ?? undefined} placeholder="ex. 3" className={inputClass} />
              </div>

              {/* Pickup / Dropoff */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><MapPin size={12} className="inline mr-1" />Pick-up *</label>
                  <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required className={inputClass} placeholder="ex. Sunlight Hotel" />
                </div>
                <div>
                  <label className={labelClass}><MapPin size={12} className="inline mr-1" />Drop-off *</label>
                  <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required className={inputClass} placeholder="ex. El Nido Town" />
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
                  className={`${inputClass} resize-none`} placeholder="ex. Need child seat, early pick-up, extra stop..." />
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
            <div className="text-center py-8 px-4">
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <Check size={28} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-1">Request Sent!</h3>
              <p className="text-gray-400 text-sm mb-6">Your booking request for <span className="font-semibold text-gray-600">{tourName}</span> has been received.</p>

              {/* Info card */}
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
