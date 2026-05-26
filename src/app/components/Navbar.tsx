import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../logo/logo.jpg';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Tours', id: 'tours' },
    { name: 'Destinations', id: 'destinations' },
    { name: 'Services', id: 'services' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5"
          >
            <img src={logo} alt="Palawan Private Rides" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-white font-bold text-lg">Palawan Private Rides</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('tours')}
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
            {navItems.map((item) => (
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
                onClick={() => scrollToSection('tours')}
                className="w-full bg-[#e8a020] text-white px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
