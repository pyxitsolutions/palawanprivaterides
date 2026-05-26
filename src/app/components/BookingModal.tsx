import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { X, Calendar, User, Phone, MapPin, Users, Clock, MessageSquare, Car } from 'lucide-react';
import { PolicyModal, type PolicyType } from './PolicyModal';

const EMAILJS_SERVICE_ID = 'service_w5vk124';
const EMAILJS_TEMPLATE_ID = 'template_pnxzs9s';
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
    if (pax <= 3) return { type: 'info', msg: `For ${pax} passenger${pax > 1 ? 's' : ''}, a Sedan/Hatchback is the most affordable option.` };
    if (pax <= 6) return { type: 'info', msg: `For ${pax} passengers, we recommend an SUV or Van for comfort.` };
    return { type: 'info', msg: `For ${pax} passengers, a Van is required.` };
  };

  const vehicleTip = pricing ? getVehicleTip() : null;
  const selectedCapacity = getSelectedCapacity();
  const overCapacity = selectedCapacity && formData.pax && parseInt(formData.pax) > selectedCapacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (pricing && !formData.vehicleType) {
      setError('Please select a vehicle type.');
      return;
    }

    if (pricing && formData.vehicleType && formData.pax) {
      const cap = defaultCapacity[formData.vehicleType];
      if (cap && parseInt(formData.pax) > cap) {
        setError(`Your group of ${formData.pax} exceeds the ${formData.vehicleType} capacity (${cap} pax). Please choose a larger vehicle.`);
        return;
      }
    }

    const lastSent = localStorage.getItem('lastBookingSent');
    if (lastSent && Date.now() - parseInt(lastSent) < 5 * 60 * 1000) {
      setError('Please wait 5 minutes before submitting another booking.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions before submitting.');
      return;
    }

    setSending(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {tourType === 'Private Ride' ? 'Book This Ride' : tourType === 'Transfer' ? 'Book a Transfer' : 'Book This Tour'}
            </h2>
            <p className="text-muted-foreground mt-1">{tourName}</p>
            {pricing && formData.vehicleType && (
              <p className="text-primary font-semibold mt-1">
                ₱{parseInt(selectedPrice).toLocaleString()} — {formData.vehicleType}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              {/* Vehicle Type (only for private rides with pricing tiers) */}
              {pricing && pricing.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <Car size={16} className="inline mr-2" />
                    Vehicle Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {pricing.map((p) => (
                      <button
                        key={p.vehicle}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, vehicleType: p.vehicle });
                        }}
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          formData.vehicleType === p.vehicle
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="text-xs text-muted-foreground mb-1">{p.vehicle}</div>
                        <div className="text-primary font-bold text-base">₱{parseInt(p.price).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">Max {p.capacity ?? defaultCapacity[p.vehicle]} pax</div>
                      </button>
                    ))}
                  </div>

                  {/* Over capacity warning */}
                  {overCapacity && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      ⚠️ Your group of {formData.pax} exceeds the {formData.vehicleType} capacity ({selectedCapacity} pax). Please choose a larger vehicle.
                    </p>
                  )}

                  {/* Pax tip */}
                  {vehicleTip && !overCapacity && (
                    <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                      💡 {vehicleTip.msg}
                    </p>
                  )}
                </div>
              )}

              {/* Beach Selection (PPC Beach Day Trip only) */}
              {tourName.includes('PPC Beach') && (
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    🏖️ Select Beach *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Tala Beach', 'Nagtabon Beach', 'Pakpak Lauin'].map((beach) => (
                      <button
                        key={beach}
                        type="button"
                        onClick={() => setFormData({ ...formData, beachSelection: beach })}
                        className={`py-3 px-2 border-2 rounded-xl text-xs font-semibold text-center transition-all ${
                          formData.beachSelection === beach
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/40 text-muted-foreground'
                        }`}
                      >
                        {beach}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Name / Lead Guest */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <User size={16} className="inline mr-2" />{tourType === 'Tour Package' ? 'Lead Guest Name' : 'Full Name'} *
                </label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Juan Dela Cruz" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <Phone size={16} className="inline mr-2" />Phone Number *
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="+63 912 345 6789" />
              </div>

              {/* Tour Date & Time */}
              <div className={`grid gap-4 ${tourType === 'Private Ride' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <Calendar size={16} className="inline mr-2" />{tourType === 'Private Ride' ? 'Travel Date' : tourType === 'Transfer' ? 'Pick-up Date' : 'Tour Date'} *
                  </label>
                  <input type="date" name="tourDate" value={formData.tourDate} onChange={handleChange} required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                {tourType === 'Private Ride' ? (
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      <Clock size={16} className="inline mr-2" />Preferred Time *
                    </label>
                    <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>
                ) : tourType === 'Transfer' ? (
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      <Clock size={16} className="inline mr-2" />Pick-up Time *
                    </label>
                    <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>
                ) : tourType === 'Tour Package' ? (
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      <Clock size={16} className="inline mr-2" />Time of Tour *
                    </label>
                    {(() => {
                      const isUnderground = tourName.includes('Underground River');
                      const isFirefly = tourName.includes('Firefly');
                      const periods = isUnderground ? ['AM (Morning)'] : isFirefly ? ['PM (Afternoon)'] : ['AM (Morning)', 'PM (Afternoon)'];
                      return (
                        <>
                          <div className={`grid gap-3 ${periods.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {periods.map((period) => (
                              <button
                                key={period}
                                type="button"
                                onClick={() => setFormData({ ...formData, tourPeriod: period })}
                                className={`py-3 border-2 rounded-xl text-sm font-semibold transition-all ${
                                  formData.tourPeriod === period
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border hover:border-primary/40 text-muted-foreground'
                                }`}
                              >
                                {period}
                              </button>
                            ))}
                          </div>
                          {isUnderground && (
                            <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                              <span className="flex-shrink-0">⚠️</span>
                              <span>Underground River tours operate <strong>AM only (8:00 AM – 4:00 PM)</strong>. PM tours are not available.</span>
                            </p>
                          )}
                          {isFirefly && (
                            <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                              <span className="flex-shrink-0">⚠️</span>
                              <span>Firefly Watching is an <strong>evening tour (PM only)</strong>. Tours depart after sundown.</span>
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : null}
              </div>

              {/* Pax */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <Users size={16} className="inline mr-2" />Number of Passengers *
                </label>
                <input
                  type="number"
                  name="pax"
                  value={formData.pax}
                  onChange={handleChange}
                  required
                  min={1}
                  max={selectedCapacity ?? undefined}
                  placeholder="Enter number of passengers"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
              </div>

              {/* Pick-up & Drop-off */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <MapPin size={16} className="inline mr-2" />Pick-up Location *
                  </label>
                  <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    placeholder="Hotel name or address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <MapPin size={16} className="inline mr-2" />Drop-off Location *
                  </label>
                  <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    placeholder="Destination or address" />
                </div>
              </div>

              {/* El Nido drop-off note */}
              {tourName.includes('El Nido') && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>For <strong>El Nido</strong> bookings: drop-off within El Nido town is included. Drop-off outside of town (e.g. resorts beyond the town center) may incur an additional charge of <strong>₱500–₱1,500</strong> depending on location.</span>
                </p>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <MessageSquare size={16} className="inline mr-2" />Special Requests (Optional)
                </label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                  placeholder="Any special requests or notes..." />
              </div>

              {/* Total */}
              {showTotal && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 space-y-2">
                  {!pricing && (tourType === 'Tour Package' || tourType === 'Transfer') && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₱{basePrice.toLocaleString()} × {paxCount} pax</span>
                      <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                  )}
                  {hasEnvFee && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Environmental fee (₱150 × {paxCount} pax)</span>
                      <span>₱{envTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-primary/20 pt-2">
                    <div className="text-sm font-semibold text-card-foreground">
                      {(tourType === 'Tour Package' && !pricing) || tourType === 'Transfer' ? 'Estimated Total' : 'Total (flat rate)'}
                    </div>
                    <div className="text-xl font-black text-primary">₱{grandTotal.toLocaleString()}</div>
                  </div>
                  {tourType === 'Tour Package' && !pricing && (
                    <p className="text-xs text-muted-foreground mt-1">Price per person × number of passengers</p>
                  )}
                  {tourType === 'Transfer' && (
                    <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>Minimum rate is ₱550. Final rate may vary depending on your drop-off location.</span>
                    </p>
                  )}
                </div>
              )}

              {/* T&C Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => setOpenPolicy('booking')} className="text-primary underline font-medium hover:opacity-80">Booking Policy</button>,{' '}
                  <button type="button" onClick={() => setOpenPolicy('cancellation')} className="text-primary underline font-medium hover:opacity-80">Cancellation Policy</button>, and{' '}
                  <button type="button" onClick={() => setOpenPolicy('terms')} className="text-primary underline font-medium hover:opacity-80">Terms & Conditions</button>{' '}
                  of Palawan Private Rides.
                </label>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-card-foreground">
                  Cancel
                </button>
                <button type="submit" disabled={sending || !agreedToTerms}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                  {sending ? 'Sending...' : 'Submit Booking Request'}
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                * We'll contact you via WhatsApp or phone to confirm your booking
              </p>
            </form>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Booking Request Sent!</h3>
              <p className="text-muted-foreground">We'll contact you via WhatsApp or phone to confirm.</p>
            </div>
          )}
        </div>
      </div>
      <PolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </div>
  );
}
