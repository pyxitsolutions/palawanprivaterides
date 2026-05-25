import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { X, Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';

const EMAILJS_SERVICE_ID = 'service_14v9rr7';
const EMAILJS_TEMPLATE_ID = 'template_mxbgzz9';
const EMAILJS_PUBLIC_KEY = '62IPmv8oqdJGM1-5I';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
  carPrice: string;
}

export function BookingModal({ isOpen, onClose, carName, carPrice }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

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
          from_email: formData.email,
          phone: formData.phone,
          car_name: carName,
          price_per_day: carPrice,
          pickup_date: formData.pickupDate,
          return_date: formData.returnDate,
          message: formData.message || 'No additional message.',
        },
        EMAILJS_PUBLIC_KEY
      );

      localStorage.setItem('lastBookingSent', Date.now().toString());

      const waMessage = encodeURIComponent(
        `🚗 New Booking!\nCar: ${carName} — ₱${carPrice}/day\nName: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPickup: ${formData.pickupDate}\nReturn: ${formData.returnDate}\nMessage: ${formData.message || 'None'}`
      );
      fetch(`https://api.callmebot.com/whatsapp.php?phone=639166846547&text=${waMessage}&apikey=1170670`).catch(() => {});

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ fullName: '', email: '', phone: '', pickupDate: '', returnDate: '', message: '' });
      }, 3000);
    } catch {
      setError('Failed to send booking. Please contact us directly.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Book Your Car</h2>
            <p className="text-muted-foreground mt-1">{carName}</p>
            <p className="text-primary font-semibold mt-1">₱{carPrice} per day</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot — hidden from real users, bots will fill this */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="juan@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="+63 912 345 6789"
                />
              </div>

              {/* Pickup Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Return Date *
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    required
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  <MessageSquare size={16} className="inline mr-2" />
                  Additional Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                  placeholder="Any special requirements or questions..."
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-card-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Submit Booking Request'}
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                * We'll contact you via email or phone to confirm your booking
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
              <p className="text-muted-foreground">
                We'll contact you shortly to confirm your reservation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
