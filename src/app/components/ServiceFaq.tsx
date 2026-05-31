import type { Tour } from '../data/tours';

const PRIVATE_RIDE_FAQ = [
  {
    q: 'Is the price per person or per booking?',
    a: 'Private ride rates are per booking — you pay for the whole vehicle, not per passenger. Sedan, SUV, and van tiers depend on your group size.',
  },
  {
    q: 'Can we request stopovers along the way?',
    a: 'Yes. Meals, photos, and quick sightseeing stops are available on request. Tell us when you book so your driver can plan the route.',
  },
  {
    q: 'Is a downpayment required?',
    a: 'Yes. A downpayment secures your slot. We confirm via WhatsApp or email and send payment details. Your booking is confirmed once received.',
  },
  {
    q: 'Are your vans shared with other tourists?',
    a: 'No. This is a private transfer for your group only — no strangers and no unplanned detours for other passengers.',
  },
];

const TOUR_FAQ = [
  {
    q: 'What is included in the tour price?',
    a: 'Inclusions are listed on this page (transport, guide, meals where noted). Environmental and entrance fees for some tours are separate government charges.',
  },
  {
    q: 'How do environmental and entrance fees work?',
    a: 'These are per-person fees collected for marine parks and sites. They are added to the base tour rate — see the price breakdown above when applicable.',
  },
  {
    q: 'Can you pick us up from our hotel?',
    a: 'Yes. Hotel pickup and drop-off in the service area are included unless stated otherwise.',
  },
];

const TRANSFER_FAQ = [
  {
    q: 'Do you track flight delays for airport pickup?',
    a: 'Share your flight details when booking. We coordinate pickup times and will adjust when possible if you notify us of delays.',
  },
  {
    q: 'Is the rate fixed?',
    a: 'Yes — the rate shown is what you pay for the transfer. No hidden charges for standard pickup and drop-off points in Puerto Princesa.',
  },
];

export function ServiceFaq({ tour }: { tour: Tour }) {
  const items =
    tour.type === 'Private Ride'
      ? PRIVATE_RIDE_FAQ
      : tour.type === 'Transfer'
        ? TRANSFER_FAQ
        : TOUR_FAQ;

  return (
    <div>
      <h2 className="text-xl font-black text-gray-900 mb-4">Common questions</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group border border-gray-200 rounded-xl bg-gray-50/50 open:bg-white open:shadow-sm"
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-bold text-gray-900 text-sm flex justify-between items-center gap-2">
              {item.q}
              <span className="text-[#e8a020] text-lg font-black group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
