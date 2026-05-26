import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { X, Calendar, User, Phone, MapPin, Users, Clock, MessageSquare, Car } from 'lucide-react';

const EMAILJS_SERVICE_ID = 'service_w5vk124';
const EMAILJS_TEMPLATE_ID = 'template_pnxzs9s';
const EMAILJS_PUBLIC_KEY = 'RaznTonJuUEVxkdZp';

interface PricingTier {
  vehicle: string;
  price: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  tourPrice: string;
  pricing?: PricingTier[];
}

export function BookingModal({ isOpen, onClose, tourName, tourPrice, pricing }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    tourDate: '',
    tourTime: '',
    pax: '',
    pickupLocation: '',
    vehicleType: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const selectedPrice = pricing && formData.vehicleType
    ? pricing.find((p) => p.vehicle === formData.vehicleType)?.price ?? tourPrice
    : tourPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (pricing && !formData.vehicleType) {
      setError('Please select a vehicle type.');
      return;
    }

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
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.fullName,
          phone: formData.phone,
          tour_name: tourName,
          vehicle_type: formData.vehicleType || 'N/A',
          tour_price: selectedPrice,
          tour_date: formData.tourDate,
          tour_time: formData.tourTime,
          pax: formData.pax,
          pickup_location: formData.pickupLocation,
          message: formData.message || 'No additional message.',
        },
        EMAILJS_PUBLIC_KEY
      );

      localStorage.setItem('lastBookingSent', Date.now().toString());

      const vehicleInfo = formData.vehicleType ? ` (${formData.vehicleType})` : '';
      const waMessage = encodeURIComponent(
        `🏝️ New Booking!\nRoute: ${tourName}${vehicleInfo}\nPrice: ₱${parseInt(selectedPrice).toLocaleString()}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nDate: ${formData.tourDate} at ${formData.tourTime}\nPax: ${formData.pax}\nPickup: ${formData.pickupLocation}\nNotes: ${formData.message || 'None'}`
      );
      fetch(`https://api.callmebot.com/whatsapp.php?phone=639217792016&text=${waMessage}&apikey=1091963`).catch(() => {});

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ fullName: '', phone: '', tourDate: '', tourTime: '', pax: '', pickupLocation: '', vehicleType: '', message: '' });
      }, 3000);
    } catch {
      setError('Failed to send booking. Please contact us directly.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Book This Tour</h2>
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
                        onClick={() => setFormData({ ...formData, vehicleType: p.vehicle })}
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          formData.vehicleType === p.vehicle
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="text-xs text-muted-foreground mb-1">{p.vehicle}</div>
                        <div className="text-primary font-bold text-base">₱{parseInt(p.price).toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <User size={16} className="inline mr-2" />Full Name *
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <Calendar size={16} className="inline mr-2" />Tour Date *
                  </label>
                  <input type="date" name="tourDate" value={formData.tourDate} onChange={handleChange} required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <Clock size={16} className="inline mr-2" />Preferred Time *
                  </label>
                  <input type="time" name="tourTime" value={formData.tourTime} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
              </div>

              {/* Pax */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <Users size={16} className="inline mr-2" />Number of Passengers *
                </label>
                <select name="pax" value={formData.pax} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="">Select number of passengers</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
                  ))}
                </select>
              </div>

              {/* Pick-up Location */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <MapPin size={16} className="inline mr-2" />Pick-up Location / Hotel *
                </label>
                <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Hotel name or address" />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <MessageSquare size={16} className="inline mr-2" />Special Requests (Optional)
                </label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                  placeholder="Any special requests or notes..." />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-card-foreground">
                  Cancel
                </button>
                <button type="submit" disabled={sending}
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
    </div>
  );
}
