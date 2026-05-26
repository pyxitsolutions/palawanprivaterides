import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CarCard } from './components/CarCard';
import { HeroCarousel } from './components/HeroCarousel';
import { Testimonials } from './components/Testimonials';
import {
  Car, Shield, Clock, Award, Phone, Mail, Facebook, MapPin,
  MessageCircle, CheckCircle, ArrowRight,
} from 'lucide-react';
import ad2 from '../ad/ad-2.png';
import ad3 from '../ad/ad-3.png';
import ad4 from '../ad/ad-4.png';
import ad5 from '../ad/ad-5.png';
import ad6 from '../ad/ad-6.png';
import ad7 from '../ad/ad-7.png';
import ad8 from '../ad/ad-8.png';
import aboutImg from '../about/about-1.png';
import whereImg from '../where/where-image.png';
import dest1 from '../dest/dest-1.png';
import dest2 from '../dest/dest-2.png';
import dest3 from '../dest/dest-3.png';
import dest4 from '../dest/dest-4.png';
import dest5 from '../dest/dest-5.png';
import rides1 from '../rides/rides-1.png';
import rides2 from '../rides/rides-2.png';
import rides3 from '../rides/rides-3.png';
import rides4 from '../rides/rides-4.png';
import rides5 from '../rides/rides-5.png';
import transfers1 from '../transfers/transfers-1.png';
import tourFirefly from '../tour/tour-firefly.png';
import tourCity from '../tour/tour-city.png';
import tourRiver from '../tour/tour-river.png';
import tourTala from '../tour/tour-tala.png';
import tourHonda from '../tour/tour-honda.png';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 pr-4">{question}</span>
        <span className="text-primary text-xl flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-500 border-t border-gray-100 pt-4 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [typeFilter, setTypeFilter] = useState('all');

  const tours = [
    {
      images: [rides1],
      name: 'PPS → El Nido',
      price: '7000',
      type: 'Private Ride',
      duration: 'Full Day (6-8 hrs)',
      pax: 'Up to 8 pax',
      description: 'Private door-to-door transfer from Puerto Princesa to El Nido Town. No stopovers, no shared vans — just your group and a trusted local driver.',
      pricing: [
        { vehicle: 'Sedan/Hatchback', price: '7000' },
        { vehicle: 'SUV', price: '7500' },
        { vehicle: 'Van', price: '8000' },
      ],
    },
    {
      images: [rides2],
      name: 'PPS → Port Barton',
      price: '5500',
      type: 'Private Ride',
      duration: 'Full Day (4-5 hrs)',
      pax: 'Up to 8 pax',
      description: 'Private transfer from Puerto Princesa to Port Barton. Comfortable, air-conditioned ride straight to this hidden gem of Palawan.',
      pricing: [
        { vehicle: 'Sedan/Hatchback', price: '5500' },
        { vehicle: 'SUV', price: '6000' },
        { vehicle: 'Van', price: '6500' },
      ],
    },
    {
      images: [rides3],
      name: 'PPS → San Vicente',
      price: '6000',
      type: 'Private Ride',
      duration: 'Full Day (5-6 hrs)',
      pax: 'Up to 8 pax',
      description: 'Private transfer to San Vicente, home of the famous Long Beach — one of the longest white sand beaches in the Philippines.',
      pricing: [
        { vehicle: 'Sedan/Hatchback', price: '6000' },
        { vehicle: 'SUV', price: '6500' },
        { vehicle: 'Van', price: '7000' },
      ],
    },
    {
      images: [rides4],
      name: 'PPS → Astotia Palawan',
      price: '3000',
      type: 'Private Ride',
      duration: 'Half Day (2-3 hrs)',
      pax: 'Up to 8 pax',
      description: 'Private transfer from Puerto Princesa to Astotia Palawan. Affordable and comfortable door-to-door service.',
      pricing: [
        { vehicle: 'Sedan/Hatchback', price: '3000' },
        { vehicle: 'SUV', price: '3500' },
        { vehicle: 'Van', price: '4000' },
      ],
    },
    {
      images: [rides5],
      name: 'PPS → Sabang / Four Points',
      price: '3500',
      type: 'Private Ride',
      duration: 'Half Day (2-3 hrs)',
      pax: 'Up to 8 pax',
      description: 'Private transfer to Sabang — gateway to the UNESCO Underground River. Perfect for day trips or overnight stays.',
      pricing: [
        { vehicle: 'Sedan/Hatchback', price: '3500' },
        { vehicle: 'SUV', price: '4000' },
        { vehicle: 'Van', price: '4500' },
      ],
    },
    {
      images: [tourCity],
      name: 'Puerto Princesa City Tour',
      price: '1500',
      type: 'Tour Package',
      duration: 'Half Day (4-5 hrs)',
      pax: 'Up to 8 pax',
      description: "Explore Puerto Princesa's highlights — Crocodile Farm, Baker's Hill, Mitra Ranch & more. Great for first-time Palawan visitors.",
    },
    {
      images: [tourRiver],
      name: 'Underground River Day Tour',
      price: '2500',
      type: 'Tour Package',
      duration: 'Full Day (8-10 hrs)',
      pax: 'Up to 8 pax',
      description: 'Visit the UNESCO World Heritage Underground River in Sabang. Includes private van transport. Permits must be arranged in advance.',
    },
    {
      images: [transfers1],
      name: 'Airport / Hotel Transfer',
      price: '500',
      type: 'Transfer',
      duration: '30–60 mins',
      pax: 'Up to 8 pax',
      description: 'Reliable, on-time pick-up from Puerto Princesa Airport to your hotel — or hotel to airport drop-off. No hidden charges.',
    },
    {
      images: [tourFirefly],
      name: 'Iwahig Firefly Watching',
      price: '1799',
      type: 'Tour Package',
      duration: 'Evening (3–4 hrs)',
      pax: 'Up to 8 pax',
      description: 'Witness thousands of fireflies lighting up the Iwahig River at night. Includes round-trip transfers, welcome drinks, buffet dinner, guided boat tour, life jackets & safety gear. ₱150 environmental fee applies.',
    },
    {
      images: [tourTala],
      name: 'Tala Beach Day Trip',
      price: '2500',
      type: 'Tour Package',
      duration: 'Full Day',
      pax: 'Up to 8 pax',
      description: 'Escape to Tala Beach — a pristine hidden shore perfect for couples, families & small groups. Includes private transport, free fuel, and a professional driver for the full day.',
    },
    {
      images: [tourHonda],
      name: 'Honda Bay Island Tour',
      price: '1800',
      type: 'Tour Package',
      duration: 'Full Day (6–8 hrs)',
      pax: 'Up to 8 pax',
      description: 'Island-hop Cowrie Island, Starfish Island, Luli Island & Pambato Reef. Includes roundtrip van transfer, island hopping boat, entrance fees, licensed tour guide, lunch, and life vest. ₱150 environmental fee applies.',
    },
  ];

  const destinations = [
    { name: 'El Nido', image: dest1, desc: 'Limestone cliffs & lagoons' },
    { name: 'Sabang', image: dest3, desc: 'Underground River & mangroves' },
    { name: 'Port Barton', image: dest4, desc: 'Secluded beaches & reefs' },
    { name: 'San Vicente', image: dest5, desc: 'Long Beach & sunsets' },
    { name: 'Puerto Princesa', image: dest2, desc: 'City tours & transfers' },
  ];


  const filteredTours = tours.filter(
    (tour) => typeFilter === 'all' || tour.type === typeFilter
  );

  const typeFilters = [
    { label: 'All', value: 'all' },
    { label: 'Private Ride', value: 'Private Ride' },
    { label: 'Tour Package', value: 'Tour Package' },
    { label: 'Transfer', value: 'Transfer' },
  ];

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section id="home" className="pt-16">
        <HeroCarousel />
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={20} />, label: 'Verified Operator' },
              { icon: <Car size={20} />, label: 'Private 8-seater SUV' },
              { icon: <Clock size={20} />, label: 'On-Time Guarantee' },
              { icon: <Award size={20} />, label: '5-Star Rated' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-primary flex-shrink-0">{item.icon}</div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Premium services,<br />locally crafted.
            </h2>
            <p className="text-lg text-gray-500">
              One trusted local team for every leg of your Palawan trip — private rides, tours, and full multi-day journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Car size={28} />,
                title: 'Private Transfers',
                desc: 'Door-to-door rides from Puerto Princesa to El Nido, Port Barton, San Vicente, Sabang & beyond. No shared vans, no detours.',
              },
              {
                icon: <MapPin size={28} />,
                title: 'Island Tours',
                desc: 'Guided day tours to Palawan\'s top destinations — Underground River, City Tour, Nacpan & more.',
              },
              {
                icon: <Clock size={28} />,
                title: 'Multi-Day Packages',
                desc: 'Planning a longer stay? We can arrange multi-day private rides and tour packages for your entire trip.',
              },
              {
                icon: <Shield size={28} />,
                title: 'Airport Transfers',
                desc: 'Reliable pick-up and drop-off at Puerto Princesa Airport. Always on time, no hidden fees.',
              },
            ].map((s, i) => (
              <div
                key={i}
                className="group p-7 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => scrollTo('tours')}
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Destinations */}
      <section id="destinations" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Where We Go</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Palawan, your way.
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From limestone lagoons to mystical caves and quiet shores — we connect every dot, privately.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {destinations.map((dest, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
                onClick={() => scrollTo('tours')}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-lg leading-tight">{dest.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours & Packages */}
      <section id="tours" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Book a Ride</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tours & Private Rides</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Choose from our curated packages or message us for a custom itinerary.
            </p>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  typeFilter === f.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => (
                <CarCard key={index} {...tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-6">No tours found for this filter.</p>
              <button
                onClick={() => setTypeFilter('all')}
                className="px-6 py-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
              >
                Show All Tours
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Us / Comfort Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-4">Why Choose Us</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                Comfort isn't a luxury here.{' '}
                <span className="text-primary">It's the standard.</span>
              </h2>
              <div className="space-y-5">
                {[
                  { title: 'Truly Private', desc: 'Your group, your schedule. No shared rides, no strangers, no detours.' },
                  { title: 'Spacious Vehicles', desc: 'Air-conditioned vans and SUVs for all group sizes, up to 8 passengers.' },
                  { title: 'Local Expert Drivers', desc: 'Our drivers know Palawan inside and out — every shortcut, every gem.' },
                  { title: 'Transparent Pricing', desc: 'Per booking, no surprise fees, ever. What you see is what you pay.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle size={22} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutImg}
                alt="Private ride in Palawan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500">3 easy steps to book your Palawan adventure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', emoji: '🏝️', title: 'Choose Your Tour', desc: 'Browse our private rides and tour packages. Pick the one that fits your itinerary and budget.' },
              { step: '02', emoji: '📋', title: 'Submit Booking', desc: 'Fill out the form with your date, time, pick-up location, and number of passengers.' },
              { step: '03', emoji: '✅', title: 'We Confirm & You Ride', desc: "We'll contact you via WhatsApp or phone to confirm. Then just sit back and enjoy Palawan!" },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-300">
                <p className="text-6xl font-black text-gray-100 mb-4 leading-none">{item.step}</p>
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="reviews">
        <Testimonials />
      </div>

      {/* CTA Banner */}
      <section className="py-24 relative bg-primary">
        <div className="absolute inset-0">
          <img src={whereImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">🌴</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to travel like locals do?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Message us on WhatsApp — get a tailored quote within minutes.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20book%20a%20tour%20in%20Palawan."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#e8a020] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d49020] transition-colors"
          >
            Plan My Trip →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-500">Everything you need to know before booking</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "What's included in the tour price?", a: "All bookings include a private vehicle and professional driver. For tour packages, a local guide may also be included. Entrance fees, boat rides, or permits (e.g. Underground River) are not included unless specified." },
              { q: 'Can I customize my itinerary?', a: "Absolutely! We offer custom private rides to any destination in Palawan. Just message us on WhatsApp or Messenger and we'll plan the trip together." },
              { q: 'How many passengers can join per booking?', a: 'Our vehicles can accommodate up to 8 passengers. For larger groups, please contact us directly and we will arrange accordingly.' },
              { q: 'Do you offer airport or hotel pick-up?', a: 'Yes! All our bookings include hotel or accommodation pick-up in Puerto Princesa. Just provide your hotel name or address when booking.' },
              { q: 'What if I need to cancel or reschedule?', a: 'We understand that plans change. Please contact us as soon as possible via WhatsApp and we will do our best to accommodate your request.' },
              { q: 'How do I confirm my booking?', a: 'After submitting the booking form, we will contact you via WhatsApp or phone within a few hours to confirm your reservation and discuss details.' },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Message us to book a tour, ask questions, or get a custom quote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { href: 'tel:+639217792016', icon: <Phone size={32} />, title: 'Phone', line1: '0921-779-2016', line2: 'Mon–Sun: 8AM–10PM' },
              { href: 'mailto:palawanprivaterides@gmail.com', icon: <Mail size={32} />, title: 'Email', line1: 'palawanprivaterides@gmail.com', line2: 'Reply within 24 hours' },
              { href: 'https://www.facebook.com/profile.php?id=61564208219838', icon: <Facebook size={32} />, title: 'Facebook', line1: 'Palawan Private Rides', line2: 'Message us on Facebook' },
              { href: 'https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20book%20a%20tour%20in%20Palawan.', icon: <MessageCircle size={32} />, title: 'WhatsApp', line1: '0921-779-2016', line2: 'Fastest response', green: true },
            ].map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white p-7 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className={`inline-block mb-4 group-hover:scale-110 transition-transform ${c.green ? 'text-green-500' : 'text-primary'}`}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{c.title}</h3>
                <p className="text-gray-500 text-sm">{c.line1}</p>
                <p className="text-xs text-gray-400 mt-1">{c.line2}</p>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-3">Palawan Private Rides</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Your trusted local partner for private rides and tours throughout Palawan.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { href: 'https://www.facebook.com/profile.php?id=61564208219838', icon: <Facebook size={18} /> },
                  { href: 'tel:+639217792016', icon: <Phone size={18} /> },
                  { href: 'mailto:palawanprivaterides@gmail.com', icon: <Mail size={18} /> },
                  { href: 'https://api.whatsapp.com/send?phone=639217792016', icon: <MessageCircle size={18} /> },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Business */}
            <div>
              <h4 className="font-bold mb-4 text-white/90">Business</h4>
              <ul className="space-y-2">
                {[
                  ['Tours', 'tours'],
                  ['Destinations', 'destinations'],
                  ['Services', 'services'],
                  ['How It Works', 'services'],
                ].map(([label, id]) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-white/90">Contact</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>+63 916-684-6547</li>
                <li>palawanprivaterides@gmail.com</li>
                <li>National Highway, San Pedro</li>
                <li>Puerto Princesa, Palawan</li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-bold mb-4 text-white/90">Policies</h4>
              <ul className="space-y-2">
                {['Booking Policy', 'Cancellation Policy', 'Privacy Policy', 'Terms & Conditions'].map((p) => (
                  <li key={p}>
                    <button className="text-white/60 hover:text-white text-sm transition-colors">{p}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/50 text-sm">&copy; 2026 Palawan Private Rides. All rights reserved.</p>
            <p className="text-white/30 text-xs">Puerto Princesa, Palawan, Philippines</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
