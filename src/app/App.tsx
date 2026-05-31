import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { InstantQuote } from './components/InstantQuote';
import { PromoPrice } from './components/PromoPrice';
import { hasPromoRate } from './utils/pricing';
import { tours } from './data/tours';
import { HeroCarousel } from './components/HeroCarousel';
import { HomePromoBanner } from './components/HomePromoBanner';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { BlogPreview } from './components/BlogPreview';
import { GalleryPreview } from './components/GalleryPreview';
import { Testimonials } from './components/Testimonials';
import { SiteFooter } from './components/SiteFooter';
import {
  Car, Shield, Clock, Award, Phone, Mail, Facebook, MapPin,
  MessageCircle, CheckCircle, ArrowRight,
} from 'lucide-react';
import aboutImg from '../about/about-1.webp';
import whereImg from '../where/where-image.webp';
import dest1 from '../dest/dest-1.webp';
import dest2 from '../dest/dest-2.webp';
import dest3 from '../dest/dest-3.webp';
import dest4 from '../dest/dest-4.webp';
import dest5 from '../dest/dest-5.webp';

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

const spinStyle = `@keyframes _spin { to { transform: rotate(360deg); } } @keyframes _fadeIn { from { opacity:0; } to { opacity:1; } }`;

export default function App() {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  const handleNavigate = (href: string) => {
    setNavigating(true);
    setTimeout(() => { setNavigating(false); navigate(href); }, 400);
  };

  const destinations = [
    { name: 'El Nido', image: dest1, desc: 'Lagoons, limestone cliffs & island hopping', href: '/destinations/el-nido' },
    { name: 'Sabang', image: dest3, desc: 'Underground River & mangroves', href: '/destinations/sabang' },
    { name: 'Port Barton', image: dest4, desc: 'Quiet beaches & coral reefs', href: '/destinations/port-barton' },
    { name: 'San Vicente', image: dest5, desc: 'Long Beach & golden sunsets', href: '/destinations/san-vicente' },
    { name: 'Puerto Princesa', image: dest2, desc: 'City tours & airport transfers', href: '/destinations/puerto-princesa' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{spinStyle}</style>
      {navigating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ animation: '_fadeIn 0.2s ease forwards' }}>
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#e8a020]" style={{ animation: '_spin 0.8s linear infinite' }} />
        </div>
      )}
      <Navbar />

      {/* Hero */}
      <section id="home">
        <HeroCarousel />
        <HomePromoBanner />
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-transparent border-b border-gray-100 relative z-10 mt-6">
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

      {/* Quick Pricing */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-2">Transparent Pricing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Routes — Starting Rates</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { route: 'Puerto Princesa → El Nido', tourName: 'PPS → El Nido', duration: '5–6 hrs', price: 6900, note: 'per booking' },
              { route: 'Puerto Princesa → Port Barton', tourName: 'PPS → Port Barton', duration: '2–3 hrs', price: 5400, note: 'per booking' },
              { route: 'Airport / Hotel Transfer', tourName: 'Airport / Hotel Transfer', duration: 'Puerto Princesa', price: 550, note: 'per booking' },
            ].map((item) => {
              const tour = tours.find((t) => t.name === item.tourName);
              return (
                <div key={item.route} className="bg-white rounded-2xl border border-gray-200 px-6 py-5 flex flex-col gap-1 hover:shadow-md transition-shadow">
                  <p className="font-bold text-gray-900 text-sm">{item.route}</p>
                  <p className="text-xs text-gray-400">{item.duration}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        {tour && hasPromoRate(tour.type) ? 'Promo rate from' : 'Starting from'}
                      </p>
                      <PromoPrice
                        amount={item.price}
                        type={tour?.type ?? 'Transfer'}
                        size="md"
                        showPromoLabel={false}
                      />
                      <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                    </div>
                    <button
                      onClick={() => navigate('/book', { state: { tourName: tour?.name, tourPrice: tour?.price, tourType: tour?.type, pricing: tour?.pricing } })}
                      className="text-xs font-bold text-[#e8a020] hover:underline flex items-center gap-1"
                    >
                      Book <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instant Quote Calculator */}
      <InstantQuote />

      {/* Premium Services */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Private Transportation<br />& Tours in Palawan
            </h2>
            <p className="text-lg text-gray-500">
              Whether you're heading to El Nido for island hopping or need a comfortable airport pickup, we handle every part of your Palawan journey — privately, professionally, and on your schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Car size={28} />,
                title: 'Private Transfers',
                desc: 'Door-to-door private van transfers from Puerto Princesa to El Nido, Port Barton, San Vicente & beyond. No shared vans, no unplanned detours.',
                href: '/rides',
              },
              {
                icon: <MapPin size={28} />,
                title: 'Island Tours',
                desc: "Explore Palawan's most iconic destinations with a private guided tour — Underground River, Honda Bay, Firefly Watching & more.",
                href: '/tours',
              },
              {
                icon: <Clock size={28} />,
                title: 'Multi-Day Packages',
                desc: "Planning a multi-stop Palawan itinerary? We'll handle your transport from start to finish so you can focus on the adventure.",
                href: '/rides',
              },
              {
                icon: <Shield size={28} />,
                title: 'Airport Transfers',
                desc: 'Arrive and leave without the stress. Our drivers meet you on time at Puerto Princesa Airport — no hidden charges, ever.',
                href: '/rides',
              },
            ].map((s, i) => (
              <div
                key={i}
                className="group p-7 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleNavigate(s.href)}
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
              Where Are You Headed in Palawan?
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From El Nido's lagoons to Port Barton's quiet shores — we get you there privately, comfortably, and on your terms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {destinations.map((dest, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
                onClick={() => handleNavigate(dest.href)}
              >
                <img
                  src={dest.image}
                  alt={`${dest.name} Palawan - Private Van Transfer destination`}
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

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button onClick={() => handleNavigate('/rides')} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <Car size={15} /> View All Private Rides
            </button>
            <button onClick={() => handleNavigate('/tours')} className="border border-primary text-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2">
              <MapPin size={15} /> View Tour Packages
            </button>
          </div>
        </div>
      </section>

      {/* Why Us / Comfort Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-4">Why Choose Us</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                The Comfortable Way to Explore Palawan
              </h2>
              <p className="text-gray-500 text-lg mb-8">We're a local Palawan transportation provider trusted by 300+ travelers. From first-time tourists to repeat visitors, our guests choose us for one reason — peace of mind from the moment they land.</p>
              <div className="space-y-5">
                {[
                  { title: 'Truly Private Rides', desc: 'Travel with only your group. No strangers, no unplanned stops, no shared van headaches.' },
                  { title: 'Clean & Comfortable Vehicles', desc: 'Air-conditioned sedans, SUVs, and vans for couples, families, and groups of up to 13 passengers.' },
                  { title: 'Local Drivers Who Know Palawan', desc: "Our drivers know the roads, the shortcuts, and the best spots along the way." },
                  { title: 'Transparent, Fixed Pricing', desc: 'No hidden charges. The rate you see is the rate you pay — every time.' },
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
              <div className="flex flex-wrap gap-3 mt-8">
                <button onClick={() => handleNavigate('/rides')} className="bg-[#e8a020] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#d49020] transition-all flex items-center gap-2">
                  <Car size={15} /> Book a Private Ride
                </button>
                <button onClick={() => handleNavigate('/tours')} className="border-2 border-primary text-primary px-6 py-3 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                  <MapPin size={15} /> Browse Tour Packages
                </button>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutImg}
                alt="Palawan Private Rides - Private van transfers and tours across Palawan Philippines"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#e8a020] uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500">3 easy steps to book your Palawan adventure</p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-9 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-0.5 bg-primary/20" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { step: '1', emoji: '🏝️', title: 'Choose Your Service', desc: 'Browse our private rides, tour packages, or airport transfers. Pick the one that fits your trip and budget.' },
                { step: '2', emoji: '📋', title: 'Submit Booking', desc: 'Fill out the form with your date, time, pick-up location, and number of passengers.' },
                { step: '3', emoji: '✅', title: 'We Confirm & You Ride', desc: "We'll contact you via WhatsApp, phone or email to confirm. Then just sit back and enjoy Palawan!" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  {/* Number circle */}
                  <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30 flex-shrink-0">
                    <span className="text-2xl font-black text-white">{item.step}</span>
                  </div>
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-12">
            <button onClick={() => handleNavigate('/rides')} className="bg-[#e8a020] text-white px-7 py-3.5 rounded-full font-bold hover:bg-[#d49020] transition-all flex items-center gap-2">
              <Car size={16} /> Browse Private Rides
            </button>
            <button onClick={() => handleNavigate('/tours')} className="bg-primary text-white px-7 py-3.5 rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <MapPin size={16} /> Browse Tour Packages
            </button>
          </div>
        </div>
      </section>

      <BlogPreview />
      <GalleryPreview />

      {/* Testimonials */}
      <div id="reviews">
        <Testimonials />
      </div>

      {/* CTA Banner */}
      <section className="py-24 relative bg-primary">
        <div className="absolute inset-0">
          <img src={whereImg} alt="Palawan Philippines map - service areas for Palawan Private Rides" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#e8a020]/20 text-[#e8a020] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8a020]/40">
            Your Palawan Adventure Awaits
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Explore<br />
            <span className="text-[#e8a020]">Palawan Your Way?</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Skip the shared vans and crowded tours. Book a private transfer or guided tour today — and experience Palawan at your own pace, with your own group.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20book%20a%20tour%20in%20Palawan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e8a020] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d49020] transition-colors shadow-lg shadow-black/20"
            >
              Book Your Private Ride Now →
            </a>
            <a
              href={`tel:+639217792016`}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              Call Us Now
            </a>
          </div>
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
              { q: 'How much does a private van transfer from Puerto Princesa to El Nido cost?', a: 'Our private van transfers to El Nido start at ₱6,900 (sedan) up to ₱7,900 (van) depending on vehicle type. Unlike shared vans, you get the entire vehicle for your group — no strangers, no unnecessary detours.' },
              { q: 'How long is the drive from Puerto Princesa to El Nido?', a: 'The drive typically takes 5 to 6 hours depending on road conditions. We recommend an early morning departure to arrive before sunset and make the most of your first day.' },
              { q: 'Do you offer airport pickup in Puerto Princesa?', a: 'Yes. We provide on-time airport transfers from Puerto Princesa Airport to any hotel in the city or surrounding areas. Just share your flight details when booking and we will be there.' },
              { q: 'Can I book a private tour for my group in Palawan?', a: 'Absolutely. We offer private day tours including the Underground River, Honda Bay Island Hopping, Iwahig Firefly Watching, and Puerto Princesa City Tour — all fully private for your group.' },
              { q: 'What vehicles do you use for transfers?', a: 'We use clean, air-conditioned Sedans, SUVs, and Vans depending on your group size. Vans accommodate up to 13 passengers comfortably.' },
              { q: 'Can I make a stop during the drive to El Nido?', a: 'Yes, stopovers for meals, sightseeing, or photos are available upon request at no extra charge. Just let us know when booking.' },
              { q: 'Is a downpayment required to confirm my booking?', a: 'Yes, a downpayment is required to secure your booking. Once we confirm via WhatsApp, phone, or email, we will send you the payment details. Your reservation is only confirmed upon receipt.' },
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

      <SiteFooter />
      <ScrollToTopButton />
    </div>
  );
}
