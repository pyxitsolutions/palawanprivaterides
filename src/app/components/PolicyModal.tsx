import { X } from 'lucide-react';

export type PolicyType = 'booking' | 'cancellation' | 'privacy' | 'terms' | null;

interface PolicyModalProps {
  policy: PolicyType;
  onClose: () => void;
}

const policies: Record<Exclude<PolicyType, null>, { title: string; content: JSX.Element }> = {
  booking: {
    title: 'Booking Policy',
    content: (
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">1. How to Book</h3>
          <p>Bookings can be made through our online booking form on this website, via WhatsApp at +63 921-779-2016, or by messaging us on Facebook. All booking requests are subject to availability and are not confirmed until you receive an official confirmation from our team.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">2. Booking Confirmation</h3>
          <p>A booking is only confirmed once you receive a confirmation message from Palawan Private Rides via WhatsApp, phone call, or email. We aim to confirm all bookings within 2–4 hours during operating hours (8AM–10PM daily). If you do not receive a confirmation within 24 hours, please contact us directly.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">3. Payment</h3>
          <p>Payment may be settled on the day of the trip in cash (Philippine Peso), unless otherwise agreed upon during confirmation. For multi-day packages or peak season bookings, a deposit may be required to secure the reservation. We will advise you of the payment terms upon confirmation.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">4. Vehicle Assignment</h3>
          <p>The vehicle type assigned to your booking will be based on your selection (Sedan/Hatchback, SUV, or Van) and confirmed availability. If your selected vehicle is unavailable, we will offer the next available option at an adjusted rate or arrange an alternative at no extra cost.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">5. Passenger Limits</h3>
          <p>Each vehicle has a maximum passenger capacity: Sedan/Hatchback — 3 passengers, SUV — 6 passengers, Van — 13 passengers. Exceeding the declared passenger count is not permitted for safety and insurance reasons. If your group size changes, please notify us immediately so we can adjust your vehicle assignment.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">6. Booking Changes</h3>
          <p>Any changes to your booking (date, time, pick-up location, or number of passengers) must be communicated to us at least 24 hours before your scheduled trip. Changes are subject to availability and may affect pricing.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">7. Waiting Time</h3>
          <p>Our driver will wait up to 30 minutes at the agreed pick-up point at no additional charge. Waiting time beyond 30 minutes may incur an additional fee of ₱100–₱200 per hour depending on the situation, to be agreed upon on-site.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">8. Environmental & Entrance Fees</h3>
          <p>Some destinations require environmental fees, entrance fees, or permits (e.g., Underground River permit, Honda Bay fees). These fees are not included in the base price unless explicitly stated. A ₱150 per person environmental fee applies to most tour packages. The Puerto Princesa City Tour is excluded from this fee.</p>
        </section>
      </div>
    ),
  },

  cancellation: {
    title: 'Cancellation Policy',
    content: (
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">1. Cancellation by the Client</h3>
          <p>We understand that plans can change. If you need to cancel your booking, please notify us as soon as possible via WhatsApp (+63 921-779-2016) or email (palawanprivaterides@gmail.com). The following cancellation terms apply:</p>
          <ul className="mt-3 space-y-2 list-none">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold flex-shrink-0">●</span><span><strong>48 hours or more before the trip:</strong> Full refund or free rebooking to a new date, whichever you prefer.</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold flex-shrink-0">●</span><span><strong>24 to 48 hours before the trip:</strong> 50% refund. We will refund half of any deposit paid, or you may opt for a rebooking with a rescheduling fee waiver on one occasion.</span></li>
            <li className="flex items-start gap-2"><span className="text-red-500 font-bold flex-shrink-0">●</span><span><strong>Less than 24 hours before the trip:</strong> No refund. The full booking amount or deposit is non-refundable due to vehicle and driver reservation costs incurred.</span></li>
            <li className="flex items-start gap-2"><span className="text-red-500 font-bold flex-shrink-0">●</span><span><strong>No-show:</strong> No refund. If the passenger fails to appear at the agreed pick-up location without prior notice, the booking is considered forfeited.</span></li>
          </ul>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">2. Rebooking</h3>
          <p>You may rebook your trip to a different date subject to vehicle availability. Rebook requests made at least 48 hours before the original trip date are free of charge. Rebook requests made within 24 hours are subject to a ₱200 rescheduling fee.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">3. Cancellation by Palawan Private Rides</h3>
          <p>In rare cases (extreme weather conditions, force majeure, or safety concerns), we may need to cancel a confirmed booking. In such cases, you will be offered a full refund or a free rebooking at your preferred date. We will notify you as early as possible.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">4. Refund Processing</h3>
          <p>Refunds, where applicable, will be processed within 3–7 business days via the original payment method or via GCash/bank transfer as agreed. Palawan Private Rides is not responsible for delays caused by banking institutions.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">5. Force Majeure</h3>
          <p>Palawan Private Rides shall not be held liable for cancellations, delays, or disruptions caused by events beyond our reasonable control, including but not limited to: natural disasters, typhoons, government-mandated restrictions, road closures, or civil unrest. In such cases, we will work with you to find the best alternative arrangement.</p>
        </section>
      </div>
    ),
  },

  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: May 2025</p>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">1. Introduction</h3>
          <p>Palawan Private Rides ("we," "us," or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the data you provide when using our website or booking our services. By submitting a booking or inquiry, you agree to the terms of this policy.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">2. Information We Collect</h3>
          <p>When you submit a booking or inquiry, we may collect the following personal information:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Full name or lead guest name</li>
            <li>Phone number (local or international)</li>
            <li>Email address (when provided)</li>
            <li>Travel date, time, and itinerary details</li>
            <li>Pick-up and drop-off locations</li>
            <li>Number of passengers</li>
            <li>Special requests or notes</li>
          </ul>
          <p className="mt-2">We do not collect payment card information directly. All financial transactions are handled in cash or through third-party payment services.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">3. How We Use Your Information</h3>
          <p>We use the information you provide solely to:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Process and confirm your booking</li>
            <li>Communicate booking details, reminders, and updates via WhatsApp, phone, or email</li>
            <li>Coordinate driver and vehicle assignments</li>
            <li>Respond to inquiries or special requests</li>
            <li>Improve our services based on general usage patterns</li>
          </ul>
          <p className="mt-2">We do not use your personal information for unsolicited marketing communications.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">4. Data Sharing</h3>
          <p>We do not sell, rent, or share your personal information with third parties for commercial purposes. Your information may be shared only with:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Our assigned driver (name and contact number, for coordination purposes only)</li>
            <li>Third-party service providers (e.g., EmailJS for booking notifications) strictly for the purpose of delivering our service</li>
            <li>Government authorities, if required by law</li>
          </ul>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">5. Data Retention</h3>
          <p>We retain your booking information for a period of up to 12 months for operational and legal record-keeping purposes. After this period, your data is deleted from our systems. You may request earlier deletion by contacting us at palawanprivaterides@gmail.com.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">6. Cookies and Website Data</h3>
          <p>Our website may use basic cookies or local storage (e.g., to prevent duplicate booking submissions within a short time window). We do not use tracking cookies or third-party advertising cookies. No personal data is stored in your browser without your interaction.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">7. Your Rights</h3>
          <p>You have the right to access, correct, or request deletion of any personal information we hold about you. To exercise these rights, contact us at palawanprivaterides@gmail.com or via WhatsApp at +63 921-779-2016.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">8. Security</h3>
          <p>We take reasonable steps to protect your personal information from unauthorized access, disclosure, or misuse. However, no method of data transmission over the internet is 100% secure. We encourage you to contact us only through trusted channels.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">9. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">10. Contact</h3>
          <p>For any privacy-related questions or concerns, please reach out to us at:<br />
          Email: palawanprivaterides@gmail.com<br />
          WhatsApp: +63 921-779-2016<br />
          Address: National Highway, San Pedro, Puerto Princesa, Palawan</p>
        </section>
      </div>
    ),
  },

  terms: {
    title: 'Terms & Conditions',
    content: (
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: May 2025</p>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
          <p>By booking or using the services of Palawan Private Rides, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not proceed with a booking.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">2. Services Provided</h3>
          <p>Palawan Private Rides provides private land transportation services in Palawan, Philippines, including but not limited to: private point-to-point transfers, guided tour packages, and airport/hotel transfers. All services are provided on a private-hire basis — no shared rides with strangers.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">3. Pricing and Fees</h3>
          <p>All prices are listed in Philippine Peso (₱) and are per booking unless stated otherwise (e.g., tour packages are priced per person). Prices are subject to change without prior notice, but confirmed bookings will honor the quoted rate. Additional charges may apply for:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Drop-off locations outside town centers (e.g., El Nido resorts beyond the town — ₱500 to ₱1,500 additional)</li>
            <li>Environmental fees, entrance fees, or government-mandated permits</li>
            <li>Excessive waiting time beyond the complimentary 30-minute allowance</li>
            <li>Tolls or extraordinary road fees applicable at the time of travel</li>
          </ul>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">4. Passenger Responsibilities</h3>
          <p>Passengers are expected to:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Be ready at the agreed pick-up point at the confirmed time</li>
            <li>Treat the driver and vehicle with respect</li>
            <li>Not exceed the declared passenger count per vehicle</li>
            <li>Not consume alcohol or illegal substances inside the vehicle</li>
            <li>Inform us of any special needs (e.g., wheelchair access, infant seats) at the time of booking</li>
          </ul>
          <p className="mt-2">Palawan Private Rides reserves the right to refuse service to passengers who are intoxicated, abusive, or in violation of these terms, without a refund.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">5. Luggage and Personal Belongings</h3>
          <p>Passengers are responsible for their own luggage and personal belongings throughout the trip. Palawan Private Rides shall not be held liable for any loss, damage, or theft of personal items during transit. Excessive luggage beyond the vehicle's reasonable storage capacity may affect passenger seating — please inform us in advance for large groups with heavy baggage.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">6. Liability Limitation</h3>
          <p>Palawan Private Rides operates with properly maintained vehicles and trained drivers. However, we shall not be liable for:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Delays caused by traffic, road conditions, or weather</li>
            <li>Missed flights, ferry connections, or tour schedules due to circumstances beyond our control</li>
            <li>Any indirect, incidental, or consequential damages arising from the use of our services</li>
          </ul>
          <p className="mt-2">Our liability is limited to the value of the booking in question.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">7. Safety</h3>
          <p>The safety of our passengers is our top priority. All vehicles are regularly inspected and maintained. Drivers hold valid professional licenses. Passengers are required to wear seatbelts at all times where available. Palawan Private Rides reserves the right to refuse a trip or alter a route in the interest of passenger safety.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">8. Governing Law</h3>
          <p>These Terms and Conditions are governed by the laws of the Republic of the Philippines. Any disputes arising from the use of our services shall be resolved through mutual agreement. If a resolution cannot be reached, disputes shall be submitted to the appropriate courts in Puerto Princesa City, Palawan.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">9. Amendments</h3>
          <p>Palawan Private Rides reserves the right to amend these Terms and Conditions at any time. Changes will be effective immediately upon posting on this website. It is the responsibility of the passenger to review these terms before each booking.</p>
        </section>
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-2">10. Contact</h3>
          <p>For any questions regarding these terms, please contact us:<br />
          Email: palawanprivaterides@gmail.com<br />
          WhatsApp: +63 921-779-2016<br />
          Address: National Highway, San Pedro, Puerto Princesa, Palawan, Philippines</p>
        </section>
      </div>
    ),
  },
};

export function PolicyModal({ policy, onClose }: PolicyModalProps) {
  if (!policy) return null;

  const { title, content } = policies[policy];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex justify-between items-center rounded-t-2xl flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {content}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
