import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { Testimonials } from './components/Testimonials';
import { SiteFooter } from './components/SiteFooter';
import {
  Car, Shield, Clock, Award, Phone, Mail, Facebook, MapPin,
  MessageCircle, CheckCircle, ArrowRight,
} from 'lucide-react';
import aboutImg from '../about/about-1.png';
import whereImg from '../where/where-image.png';
import dest1 from '../dest/dest-1.png';
import dest2 from '../dest/dest-2.png';
import dest3 from '../dest/dest-3.png';
import dest4 from '../dest/dest-4.png';
import dest5 from '../dest/dest-5.png';

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
    { name: 'El Nido', image: dest1, desc: 'Limestone cliffs & lagoons' },
    { name: 'Sabang', image: dest3, desc: 'Underground River & mangroves' },
    { name: 'Port Barton', image: dest4, desc: 'Secluded beaches & reefs' },
    { name: 'San Vicente', image: dest5, desc: 'Long Beach & sunsets' },
    { name: 'Puerto Princesa', image: dest2, desc: 'City tours & transfers' },
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
                href: '/rides',
              },
              {
                icon: <MapPin size={28} />,
                title: 'Island Tours',
                desc: "Guided day tours to Palawan's top destinations — Underground River, City Tour, Nacpan & more.",
                href: '/tours',
              },
              {
                icon: <Clock size={28} />,
                title: 'Multi-Day Packages',
                desc: 'Planning a longer stay? We can arrange multi-day private rides and tour packages for your entire trip.',
                href: '/rides',
              },
              {
                icon: <Shield size={28} />,
                title: 'Airport Transfers',
                desc: 'Reliable pick-up and drop-off at Puerto Princesa Airport. Always on time, no hidden fees.',
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
                onClick={() => navigate('/rides')}
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
                { step: '3', emoji: '✅', title: 'We Confirm & You Ride', desc: "We'll contact you via WhatsApp or phone to confirm. Then just sit back and enjoy Palawan!" },
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
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#e8a020]/20 text-[#e8a020] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8a020]/40">
            Your Palawan Adventure Awaits
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to travel<br />
            <span className="text-[#e8a020]">like locals do?</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Private rides. Real experiences. No tourist traps. Message us on WhatsApp and get your tailored quote within minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20book%20a%20tour%20in%20Palawan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e8a020] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d49020] transition-colors shadow-lg shadow-black/20"
            >
              Plan My Trip →
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
              { q: "What's included in the tour price?", a: "All bookings include a private vehicle and professional driver. For tour packages, a local guide may also be included. Entrance fees, boat rides, or permits (e.g. Underground River) are not included unless specified." },
              { q: 'Can I customize my itinerary?', a: "Absolutely! We offer custom private rides to any destination in Palawan. Just message us on WhatsApp or Messenger and we'll plan the trip together." },
              { q: 'How many passengers can join per booking?', a: 'Our vehicles can accommodate up to 13 passengers. For larger groups, please contact us directly and we will arrange accordingly.' },
              { q: 'Do you offer airport or hotel pick-up?', a: 'Yes! All our bookings include hotel or accommodation pick-up in Puerto Princesa. Just provide your hotel name or address when booking.' },
              { q: 'What if I need to cancel or reschedule?', a: 'We understand that plans change. Please contact us as soon as possible via WhatsApp and we will do our best to accommodate your request.' },
              { q: 'How do I confirm my booking?', a: 'After submitting the booking form, we will contact you via WhatsApp or phone within a few hours to confirm your reservation and discuss details.' },
              { q: 'Is a downpayment required to confirm my booking?', a: 'Yes, a downpayment is required to secure and confirm your booking. Once we get in touch via WhatsApp or phone, we will provide the downpayment details. Your reservation will only be confirmed upon receipt of the downpayment.' },
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
