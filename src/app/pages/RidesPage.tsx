import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { CarCard } from '../components/CarCard';
import { privateRides } from '../data/tours';
import { Shield, Users, MapPin, Clock, MessageCircle } from 'lucide-react';
import heroImg from '../../rides/rides-1.png';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Private Rides', value: 'Private Ride' },
  { label: 'Airport Transfer', value: 'Transfer' },
];

const highlights = [
  { icon: <Shield size={18} />, label: 'No Shared Rides' },
  { icon: <Users size={18} />, label: 'Private Group Only' },
  { icon: <MapPin size={18} />, label: 'Door-to-Door' },
  { icon: <Clock size={18} />, label: 'Flexible Schedule' },
];

export default function RidesPage() {
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = privateRides.filter(
    (t) => typeFilter === 'all' || t.type === typeFilter
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end">
        <img
          src={heroImg}
          alt="Private Rides Palawan"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <p className="text-[#e8a020] text-sm font-bold uppercase tracking-widest mb-3">
            Private Land Transport
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Private Rides<br />
            <span className="text-[#e8a020]">& Transfers</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8">
            Door-to-door transfers across Palawan — just your group, your driver, and the open road.
          </p>

          {/* Highlight pills */}
          <div className="flex flex-wrap gap-3">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full"
              >
                <span className="text-[#e8a020]">{h.icon}</span>
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rides Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  typeFilter === f.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((tour, index) => (
              <CarCard key={index} {...tour} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-3xl bg-primary overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
              <div>
                <p className="text-[#e8a020] text-xs font-bold uppercase tracking-widest mb-1">Custom Route</p>
                <h3 className="text-2xl font-black text-white mb-1">Don't see your destination?</h3>
                <p className="text-white/60 text-sm">We go anywhere in Palawan — just ask us for a quote.</p>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20need%20a%20custom%20transfer%20in%20Palawan."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#e8a020] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#d49020] transition-colors"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
      <ScrollToTopButton />
    </div>
  );
}
