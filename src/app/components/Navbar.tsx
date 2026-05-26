import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '../../logo/logo.png';
import ridesHero from '../../rides/rides-1.png';
import toursHero from '../../tour/tour-city.png';

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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        style={{ animation: exiting ? 'backdropOut 0.3s ease forwards' : 'backdropIn 0.25s ease' }}
        onClick={!exiting ? onClose : undefined}
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
                alt="Private Rides"
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
                alt="Tour Packages"
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/60 backdrop-blur-md">
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
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => setShowBookModal(true)}
                className="bg-[#e8a020] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d49020] transition-colors"
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
    </>
  );
}
