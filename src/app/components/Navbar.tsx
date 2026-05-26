import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '../../logo/logo.png';
import ridesHero from '../../rides/rides-1.png';
import toursHero from '../../tour/tour-city.png';

function BookNowModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <p className="text-xs font-bold text-[#e8a020] uppercase tracking-widest mb-1">Book Now</p>
            <h2 className="text-2xl font-black text-gray-900">Choose Your Journey</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-8 pb-8 pt-2">
          {/* Private Rides */}
          <Link
            to="/rides"
            onClick={onClose}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
          >
            <img
              src={ridesHero}
              alt="Private Rides"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[#e8a020] text-[10px] font-bold uppercase tracking-widest mb-1">Intercity Transport</p>
              <h3 className="text-xl font-black text-white mb-1">Private Rides</h3>
              <p className="text-white/60 text-xs mb-4">El Nido · Port Barton · San Vicente & more</p>
              <span className="inline-flex items-center gap-1.5 bg-white text-primary px-4 py-2 rounded-full text-xs font-bold group-hover:bg-[#e8a020] group-hover:text-white transition-colors">
                View Rides <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {/* Tour Packages */}
          <Link
            to="/tours"
            onClick={onClose}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
          >
            <img
              src={toursHero}
              alt="Tour Packages"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[#e8a020] text-[10px] font-bold uppercase tracking-widest mb-1">Puerto Princesa</p>
              <h3 className="text-xl font-black text-white mb-1">Tour Packages</h3>
              <p className="text-white/60 text-xs mb-4">Underground River · Honda Bay · Firefly</p>
              <span className="inline-flex items-center gap-1.5 bg-white text-primary px-4 py-2 rounded-full text-xs font-bold group-hover:bg-[#e8a020] group-hover:text-white transition-colors">
                View Tours <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
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
