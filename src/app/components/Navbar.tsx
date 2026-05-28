import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { CURRENCIES, useCurrency, type CurrencyCode } from '../context/CurrencyContext';
import logo from '../../logo/logo.webp';
import ridesHero from '../../rides/rides-1.webp';
import toursHero from '../../tour/tour-city.webp';

const transitionStyles = `
  @keyframes backdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes backdropOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes modalSlideDown {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(30px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInLoader {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

function BookNowModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  const handleNavigate = (href: string) => {
    setExiting(true);
    setTimeout(() => {
      onClose();
      navigate(href);
    }, 350);
  };

  return (
    <>
      <style>{transitionStyles}</style>

      {/* Loading spinner overlay */}
      {exiting && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          style={{ animation: 'fadeInLoader 0.2s ease forwards' }}
        >
          <div
            className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#e8a020]"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </div>
      )}

      {/* Backdrop */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm outline-none"
        style={{ animation: exiting ? 'backdropOut 0.3s ease forwards' : 'backdropIn 0.25s ease' }}
        onClick={!exiting ? onClose : undefined}
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
          style={{
            height: '420px',
            animation: 'modalSlideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" />
          </button>

          {/* Top label */}
          <div className="absolute top-4 left-5 z-20">
            <span className="text-[10px] font-bold text-[#e8a020] uppercase tracking-widest bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              Book Now — Choose Your Journey
            </span>
          </div>

          {/* Split cards */}
          <div className="flex h-full">
            {/* Private Rides */}
            <button
              onClick={() => handleNavigate('/rides')}
              className="group relative flex-1 overflow-hidden text-left"
            >
              <img
                src={ridesHero}
                alt="Private van transfers Palawan - Puerto Princesa to El Nido, Port Barton and San Vicente"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <p className="text-[#e8a020] text-[10px] font-bold uppercase tracking-widest mb-2">Intercity Transport</p>
                <h3 className="text-2xl font-black text-white mb-2">Private Rides</h3>
                <p className="text-white/70 text-xs mb-6 leading-relaxed">
                  El Nido · Port Barton<br />San Vicente & more
                </p>
                <span className="inline-flex items-center gap-1.5 bg-[#e8a020] text-white px-5 py-2 rounded-full text-xs font-bold group-hover:bg-white group-hover:text-primary transition-colors">
                  View Rides <ArrowRight size={12} />
                </span>
              </div>
            </button>

            {/* Divider */}
            <div className="w-px bg-white/20 z-10 flex-shrink-0" />

            {/* Tour Packages */}
            <button
              onClick={() => handleNavigate('/tours')}
              className="group relative flex-1 overflow-hidden text-left"
            >
              <img
                src={toursHero}
                alt="Palawan tour packages - Underground River, Honda Bay, Firefly Watching and El Nido island tours"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <p className="text-[#e8a020] text-[10px] font-bold uppercase tracking-widest mb-2">Puerto Princesa</p>
                <h3 className="text-2xl font-black text-white mb-2">Tour Packages</h3>
                <p className="text-white/70 text-xs mb-6 leading-relaxed">
                  Underground River · Honda Bay<br />Firefly & more
                </p>
                <span className="inline-flex items-center gap-1.5 bg-[#e8a020] text-white px-5 py-2 rounded-full text-xs font-bold group-hover:bg-white group-hover:text-primary transition-colors">
                  View Tours <ArrowRight size={12} />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = CURRENCIES.find((c) => c.code === currency)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (code: CurrencyCode) => {
    setCurrency(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-[#1a3a2a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => select(c.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                c.code === currency
                  ? 'bg-[#e8a020] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  const scrollLinks = [
    { name: 'Destinations', id: 'destinations' },
    { name: 'Contact', id: 'contact' },
  ];


  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? 'bg-primary/95 shadow-lg shadow-black/20'
          : 'bg-primary/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none">
              <img src={logo} alt="Palawan Private Rides" className="h-9 w-9 rounded-full object-cover" />
              <span className="text-white font-bold text-lg">Palawan Private Rides</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {scrollLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-white/80 hover:text-white transition-colors text-sm font-medium group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8a020] group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
              ))}
              <Link
                to="/gallery"
                className="relative text-white/80 hover:text-white transition-colors text-sm font-medium group"
              >
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8a020] group-hover:w-full transition-all duration-300 rounded-full" />
                Gallery
              </Link>
              <Link
                to="/blog"
                className="relative text-white/80 hover:text-white transition-colors text-sm font-medium group"
              >
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8a020] group-hover:w-full transition-all duration-300 rounded-full" />
                Blog
              </Link>
              <CurrencySelector />
              <button
                onClick={() => setShowBookModal(true)}
                onMouseDown={(e) => e.preventDefault()}
                className="bg-[#e8a020] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d49020] hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-black/20"
              >
                Book Now →
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-primary border-t border-white/10">
            <div className="px-4 py-3 space-y-1">
              {scrollLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                >
                  {item.name}
                </button>
              ))}
              <Link
                to="/gallery"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                Gallery
              </Link>
              <Link
                to="/blog"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                Blog
              </Link>
              <div className="px-3 py-2">
                <p className="text-white/50 text-xs mb-1.5 uppercase tracking-widest font-semibold">Currency</p>
                <div className="flex flex-wrap gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setIsOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        c.code === currency
                          ? 'bg-[#e8a020] text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => { setIsOpen(false); setShowBookModal(true); }}
                  className="block w-full text-center bg-[#e8a020] text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                >
                  Book Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {showBookModal && <BookNowModal onClose={() => setShowBookModal(false)} />}


      {/* Floating chat buttons — WhatsApp + Messenger */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-0">

        {/* Messenger */}
        <a
          href="https://m.me/61564208219838"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-end gap-2"
        >
          <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-2xl rounded-br-sm shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
            Message on Messenger
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200" style={{ background: 'linear-gradient(135deg, #0099FF, #A033FF, #FF5C87)' }}>
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.16 0 11.527c0 3.644 1.793 6.9 4.608 9.023V24l4.27-2.38C9.954 21.86 10.963 22 12 22c6.627 0 12-4.84 12-10.473S18.627 0 12 0zm1.193 14.963l-3.056-3.26-5.963 3.26L10.733 8.4l3.13 3.26L19.752 8.4l-6.56 6.563z"/>
            </svg>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://api.whatsapp.com/send?phone=639217792016&text=Hi!%20I%20want%20to%20book%20a%20private%20ride%20or%20tour%20in%20Palawan."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-end gap-2"
          style={{ marginTop: '-6px' }}
        >
          <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-2xl rounded-br-sm shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
            Chat with us 👋
          </div>
          <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:bg-[#1ebe5d] hover:scale-110 transition-all duration-200">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.518 5.829L.057 23.5l5.83-1.527A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.368l-.359-.213-3.72.975.993-3.635-.234-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
          </div>
        </a>
      </div>
    </>
  );
}
